import "dotenv/config";
import "../models/show";
import ffmpegPath from "ffmpeg-static";
import mongoose from "mongoose";
import { DateTime } from "luxon";
import { spawn, type ChildProcess } from "node:child_process";
import { constants, createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import LiveStream from "../models/LiveStream";
import Schedule from "../models/schedules";
import ArchivedShow from "../models/ArchivedShow";

type ScheduleDocument = {
  _id: mongoose.Types.ObjectId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show: any;
  day: string;
  customDays?: string[];
  startTime: string;
  endTime: string;
  timezone?: string;
  duration?: number;
  linkedStream?: string;
  backupStream?: string;
  status: string;
};

type LiveStreamDocument = {
  _id: mongoose.Types.ObjectId;
  stationName: string;
  streamUrl: string;
  backupStreamUrl?: string;
  isActive: boolean;
};

type StreamCandidate = {
  url: string;
  source: string;
};

type ScheduleWindow = {
  start: Date;
  end: Date;
  timezone: string;
};

type ActiveJob = {
  key: string;
  child: ChildProcess | null;
  outputPath: string;
  scheduleId: string;
  showId: string;
  broadcastStart: Date;
  plannedEnd: Date;
  startedAt: Date;
  title: string;
  host: string;
  artworkUrl: string;
};

const {
  MONGODB_URI,
  B2_ENDPOINT,
  B2_REGION,
  B2_BUCKET_NAME,
  B2_KEY_ID,
  B2_APPLICATION_KEY,
  RECORDINGS_DIR = path.resolve(process.cwd(), "recordings"),
  POLL_INTERVAL_MS = "15000",
  WORKER_ID = `radio-huns-recorder-${process.pid}`,
} = process.env;

// Safe by default. Set WORKER_MODE=record only after testing.
const WORKER_MODE = process.env.WORKER_MODE ?? "check";

if (!["check", "record"].includes(WORKER_MODE)) {
  throw new Error('WORKER_MODE must be "check" or "record".');
}

if (
  !MONGODB_URI ||
  !B2_ENDPOINT ||
  !B2_REGION ||
  !B2_BUCKET_NAME ||
  !B2_KEY_ID ||
  !B2_APPLICATION_KEY
) {
  throw new Error(
    "Missing required environment variables. Check MONGODB_URI and B2_* in your root .env file.",
  );
}

const pollMs = Math.max(5000, Number(POLL_INTERVAL_MS) || 15000);

// Stored URLs are temporary. The archive API should create a fresh
// playback URL using storageKey when an archive is requested.
const SIGNED_URL_SECONDS = 7 * 24 * 60 * 60;

// After a failed recording, wait this long before retrying the same window.
const FAILURE_COOLDOWN_MS = 60_000;

const b2 = new S3Client({
  region: B2_REGION,
  endpoint: B2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: B2_KEY_ID,
    secretAccessKey: B2_APPLICATION_KEY,
  },
});

const activeJobs = new Map<string, ActiveJob>();

// key -> timestamp (ms) until which this schedule window must not be retried
const failureCooldowns = new Map<string, number>();

// Resolved at startup by resolveFfmpegBinary().
let ffmpegBinary = "ffmpeg";

let shuttingDown = false;
let pollRunning = false;
let pollTimer: ReturnType<typeof setInterval> | undefined;

function log(
  level: "INFO" | "WARN" | "ERROR",
  message: string,
  extra?: unknown,
) {
  const suffix = extra === undefined ? "" : ` ${JSON.stringify(extra)}`;
  console.log(`${new Date().toISOString()} [${level}] ${message}${suffix}`);
}

/**
 * Prefer the binary bundled by ffmpeg-static. If it is missing or not
 * executable (e.g. install scripts were skipped), fall back to a
 * system-installed "ffmpeg" found on PATH.
 */
async function resolveFfmpegBinary(): Promise<string> {
  if (ffmpegPath) {
    try {
      await fs.access(ffmpegPath, constants.X_OK);
      log("INFO", "Using bundled FFmpeg", { ffmpegPath });
      return ffmpegPath;
    } catch {
      log(
        "WARN",
        "Bundled FFmpeg not found or not executable; falling back to system ffmpeg",
        { ffmpegPath },
      );
    }
  } else {
    log("WARN", "ffmpeg-static returned no path; falling back to system ffmpeg");
  }

  return "ffmpeg";
}

function validTime(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function scheduleDays(schedule: ScheduleDocument): string[] {
  const custom = (schedule.customDays ?? []).filter(Boolean);
  return custom.length ? custom : [schedule.day];
}

/**
 * Find the active recording window in the schedule's own timezone.
 * Also checks yesterday's start date to support overnight shows.
 */
function getScheduleWindow(
  schedule: ScheduleDocument,
  now: Date,
): ScheduleWindow | null {
  const timezone = schedule.timezone || "America/Toronto";

  if (!validTime(schedule.startTime) || !validTime(schedule.endTime)) {
    throw new Error(
      `Invalid schedule time for ${schedule._id}: expected HH:mm`,
    );
  }

  const localNow = DateTime.fromJSDate(now, { zone: timezone });

  if (!localNow.isValid) {
    throw new Error(`Invalid timezone "${timezone}"`);
  }

  for (const localStartDate of [localNow, localNow.minus({ days: 1 })]) {
    if (!scheduleDays(schedule).includes(localStartDate.toFormat("cccc"))) {
      continue;
    }

    const date = localStartDate.toFormat("yyyy-MM-dd");

    const start = DateTime.fromFormat(
      `${date} ${schedule.startTime}`,
      "yyyy-MM-dd HH:mm",
      { zone: timezone },
    );

    let end = DateTime.fromFormat(
      `${date} ${schedule.endTime}`,
      "yyyy-MM-dd HH:mm",
      { zone: timezone },
    );

    if (!start.isValid || !end.isValid) continue;

    // An end time equal to or earlier than the start time means
    // the show ends on the following day.
    if (end <= start) {
      end = end.plus({ days: 1 });
    }

    const startDate = start.toJSDate();
    const endDate = end.toJSDate();

    if (now >= startDate && now < endDate) {
      return {
        start: startDate,
        end: endDate,
        timezone,
      };
    }
  }

  return null;
}

function safeSlug(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "show"
  );
}

async function ensureDir() {
  await fs.mkdir(RECORDINGS_DIR, { recursive: true });
}

/**
 * Priority:
 * 1. Schedule.linkedStream
 * 2. Schedule.backupStream
 * 3. Active station's streamUrl
 * 4. Active station's backupStreamUrl
 *
 * Duplicate URLs are removed while preserving their priority.
 */
async function getStreamCandidates(
  schedule: ScheduleDocument,
): Promise<StreamCandidate[]> {
  const activeStation = (await LiveStream.findOne({
    isActive: true,
  })
    .sort({ createdAt: 1 })
    .lean()) as unknown as LiveStreamDocument | null;

  const candidates: StreamCandidate[] = [
    {
      url: schedule.linkedStream?.trim() ?? "",
      source: "linkedStream",
    },
    {
      url: schedule.backupStream?.trim() ?? "",
      source: "backupStream",
    },
    {
      url: activeStation?.streamUrl?.trim() ?? "",
      source: "station.streamUrl",
    },
    {
      url: activeStation?.backupStreamUrl?.trim() ?? "",
      source: "station.backupStreamUrl",
    },
  ].filter((candidate) => candidate.url.length > 0);

  return candidates.filter(
    (candidate, index, array) =>
      array.findIndex((item) => item.url === candidate.url) === index,
  );
}

function ffmpegArgs(
  streamUrl: string,
  outputPath: string,
  seconds: number,
): string[] {
  return [
    "-hide_banner",
    "-nostdin",
    "-loglevel",
    "warning",
    "-y",
    "-rw_timeout",
    "15000000",
    "-reconnect",
    "1",
    "-reconnect_streamed",
    "1",
    "-reconnect_delay_max",
    "5",
    "-i",
    streamUrl,
    "-t",
    String(Math.max(1, Math.floor(seconds))),
    "-vn",
    "-acodec",
    "libmp3lame",
    "-b:a",
    "128k",
    "-ar",
    "44100",
    "-ac",
    "2",
    "-f",
    "mp3",
    outputPath,
  ];
}

function runFfmpeg(
  streamUrl: string,
  outputPath: string,
  seconds: number,
  onChild: (child: ChildProcess) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // FIX: spawn the resolved binary (bundled path or system fallback)
    // instead of the bare "ffmpeg" command, which caused ENOENT.
    const child = spawn(
      ffmpegBinary,
      ffmpegArgs(streamUrl, outputPath, seconds),
      {
        stdio: ["ignore", "ignore", "pipe"],
      },
    );

    onChild(child);

    let stderr = "";
    let settled = false;

    child.stderr?.on("data", (chunk: Buffer) => {
      stderr = (stderr + chunk.toString()).slice(-8000);
    });

    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });

    child.once("close", (code, signal) => {
      if (settled) return;
      settled = true;

      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `FFmpeg exited with code ${code}, signal ${
              signal ?? "none"
            }. ${stderr}`,
          ),
        );
      }
    });
  });
}

async function uploadToB2(filePath: string, key: string): Promise<string> {
  await b2.send(
    new PutObjectCommand({
      Bucket: B2_BUCKET_NAME!,
      Key: key,
      Body: createReadStream(filePath),
      ContentType: "audio/mpeg",
      CacheControl: "private, no-store",
    }),
  );

  return getSignedUrl(
    b2,
    new GetObjectCommand({
      Bucket: B2_BUCKET_NAME!,
      Key: key,
    }),
    { expiresIn: SIGNED_URL_SECONDS },
  );
}

async function startRecording(
  schedule: ScheduleDocument,
  window: ScheduleWindow,
  now: Date,
  candidates: StreamCandidate[],
) {
  const show = schedule.show;

  if (!show || !show._id) {
    log("WARN", "Skipping schedule: show is not populated", {
      scheduleId: String(schedule._id),
    });
    return;
  }

  if (candidates.length === 0) {
    log("WARN", "No usable stream URLs found", {
      scheduleId: String(schedule._id),
    });
    return;
  }

  const showId = String(show._id);
  const scheduleId = String(schedule._id);
  const key = `${scheduleId}:${window.start.toISOString()}`;

  if (activeJobs.has(key)) return;

  // FIX: respect the cooldown after a failed attempt so a broken stream
  // or setup problem isn't retried every poll cycle.
  const cooldownUntil = failureCooldowns.get(key);
  if (cooldownUntil !== undefined) {
    if (Date.now() < cooldownUntil) return;
    failureCooldowns.delete(key);
  }

  // Check for an existing archive before recording.
  const existing = await ArchivedShow.exists({
    schedule: schedule._id,
    broadcastDate: window.start,
  });

  if (existing) {
    log("INFO", "Archive already exists; skipping", {
      scheduleId,
      broadcastStart: window.start.toISOString(),
    });
    return;
  }

  const remainingSeconds = Math.floor(
    (window.end.getTime() - now.getTime()) / 1000,
  );

  if (remainingSeconds < 15) {
    log("WARN", "Too little time remains to record", {
      scheduleId,
      remainingSeconds,
    });
    return;
  }

  await ensureDir();

  const title = String(show.showName || show.shortTitle || "Radio Huns Show");

  const base =
    `${safeSlug(title)}-` + window.start.toISOString().replace(/[:.]/g, "-");

  const outputPath = path.join(RECORDINGS_DIR, `${base}-${randomUUID()}.mp3`);

  const job: ActiveJob = {
    key,
    child: null,
    outputPath,
    scheduleId,
    showId,
    broadcastStart: window.start,
    plannedEnd: window.end,
    startedAt: new Date(),
    title,
    host: typeof show.host === "string" ? show.host : "",
    artworkUrl: String(show.coverImage || ""),
  };

  activeJobs.set(key, job);

  log("INFO", "Recording started", {
    worker: WORKER_ID,
    title,
    scheduleId,
    streamCandidates: candidates.map((candidate) => candidate.source),
    broadcastStart: window.start.toISOString(),
    plannedEnd: window.end.toISOString(),
    remainingSeconds,
  });

  void finishRecording(job, candidates);
}

async function finishRecording(job: ActiveJob, candidates: StreamCandidate[]) {
  let successfulSource: string | undefined;
  let lastError: unknown;

  try {
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (!candidate) continue;

      // Recalculate the remaining time after each failed stream.
      const remainingSeconds = Math.floor(
        (job.plannedEnd.getTime() - Date.now()) / 1000,
      );

      if (remainingSeconds < 15) {
        log("WARN", "Not enough scheduled time remains for another stream", {
          scheduleId: job.scheduleId,
          remainingSeconds,
        });
        break;
      }

      try {
        await fs.rm(job.outputPath, { force: true });

        await runFfmpeg(
          candidate.url,
          job.outputPath,
          remainingSeconds,
          (child) => {
            job.child = child;
          },
        );

        job.child = null;
        successfulSource = candidate.source;
        break;
      } catch (error) {
        job.child = null;
        lastError = error;

        log("WARN", `Stream attempt ${i + 1} failed`, {
          scheduleId: job.scheduleId,
          source: candidate.source,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (!successfulSource) {
      throw lastError instanceof Error
        ? lastError
        : new Error("All stream sources failed or no scheduled time remained");
    }

    const stat = await fs.stat(job.outputPath);

    if (stat.size < 16_000) {
      throw new Error(`Recording file too small (${stat.size} bytes)`);
    }

    // Approximate duration for a 128 kbps CBR MP3.
    const durationSeconds = Math.max(1, Math.round((stat.size * 8) / 128_000));

    const storageKey =
      `archives/${job.showId}/${job.scheduleId}/` +
      `${job.broadcastStart.toISOString().slice(0, 10)}/` +
      `${path.basename(job.outputPath)}`;

    const audioUrl = await uploadToB2(job.outputPath, storageKey);

    try {
      await ArchivedShow.create({
        show: job.showId,
        schedule: job.scheduleId,
        title: job.title,
        host: job.host,
        broadcastDate: job.broadcastStart,
        durationSeconds,
        audioUrl,
        storageKey,
        artworkUrl: job.artworkUrl,
        status: "published",
      });
    } catch (error: unknown) {
      const mongoError = error as { code?: number };

      if (mongoError.code === 11000) {
        log("WARN", "Duplicate archive document skipped", {
          scheduleId: job.scheduleId,
          broadcastStart: job.broadcastStart.toISOString(),
        });
      } else {
        throw error;
      }
    }

    failureCooldowns.delete(job.key);

    log("INFO", "Archive uploaded and saved", {
      title: job.title,
      scheduleId: job.scheduleId,
      storageKey,
      successfulSource,
      durationSeconds,
      playbackUrlExpiresInSeconds: SIGNED_URL_SECONDS,
    });
  } catch (error) {
    // FIX: back off before this window can be retried.
    failureCooldowns.set(job.key, Date.now() + FAILURE_COOLDOWN_MS);

    log("ERROR", "Recording job failed", {
      title: job.title,
      scheduleId: job.scheduleId,
      retryInSeconds: FAILURE_COOLDOWN_MS / 1000,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    activeJobs.delete(job.key);

    try {
      await fs.rm(job.outputPath, { force: true });
    } catch (error) {
      log("WARN", "Could not remove local recording file", {
        path: job.outputPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

async function pollSchedules() {
  if (pollRunning || shuttingDown) return;

  pollRunning = true;

  try {
    const now = new Date();

    // Drop expired cooldown entries so the map doesn't grow forever.
    for (const [key, until] of failureCooldowns) {
      if (until < Date.now() - 24 * 60 * 60 * 1000) {
        failureCooldowns.delete(key);
      }
    }

    const schedules = (await Schedule.find({
      status: { $in: ["published", "scheduled"] },
    })
      .populate("show", "showName shortTitle host coverImage")
      .lean()) as unknown as ScheduleDocument[];

    log("INFO", "Schedules loaded", {
      count: schedules.length,
      mode: WORKER_MODE,
    });

    for (const schedule of schedules) {
      try {
        const window = getScheduleWindow(schedule, now);

        if (!window) {
          if (WORKER_MODE === "check") {
            const timezone = schedule.timezone || "America/Toronto";
            const localNow = DateTime.fromJSDate(now, { zone: timezone });
            const localDay = localNow.toFormat("cccc");
            const days = scheduleDays(schedule);

            const showName = String(
              schedule.show?.showName ??
                schedule.show?.shortTitle ??
                "Unknown show",
            );

            // Temporarily log schedules that run today or the test show.
            if (
              days.includes(localDay) ||
              showName.toLowerCase().includes("punjabi top 10")
            ) {
              log("INFO", "Schedule not currently active", {
                show: showName,
                scheduleId: String(schedule._id),
                configuredDays: days,
                localDay,
                localTime: localNow.toFormat("HH:mm:ss"),
                timezone,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
              });
            }
          }

          continue;
        }

        // Resolve URLs in check mode too, so you can verify which
        // stream sources are available without starting FFmpeg.
        const candidates = await getStreamCandidates(schedule);

        if (WORKER_MODE === "check") {
          log(
            "INFO",
            "Eligible schedule found; recording skipped in check mode",
            {
              scheduleId: String(schedule._id),
              show: schedule.show?.showName ?? "Unknown show",
              timezone: window.timezone,
              broadcastStart: window.start.toISOString(),
              broadcastEnd: window.end.toISOString(),
              streamCandidates: candidates.map((candidate) => candidate.source),
              hasUsableStream: candidates.length > 0,
            },
          );

          continue;
        }

        await startRecording(schedule, window, now, candidates);
      } catch (error) {
        log("ERROR", "Unable to evaluate schedule", {
          scheduleId: String(schedule._id),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  } catch (error) {
    log("ERROR", "Schedule polling failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    pollRunning = false;
  }
}

async function shutdown(signal: string) {
  if (shuttingDown) return;

  shuttingDown = true;

  if (pollTimer) clearInterval(pollTimer);

  log("WARN", `Received ${signal}; stopping FFmpeg jobs`);

  for (const job of activeJobs.values()) {
    try {
      job.child?.kill("SIGTERM");
    } catch (error) {
      log("WARN", "Could not stop FFmpeg process", {
        scheduleId: job.scheduleId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const deadline = Date.now() + 10_000;

  while (activeJobs.size > 0 && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  for (const job of activeJobs.values()) {
    try {
      job.child?.kill("SIGKILL");
    } catch {
      // The child may already have exited.
    }
  }

  await mongoose.disconnect();
  b2.destroy();
  process.exit(0);
}

async function main() {
  await ensureDir();

  // FIX: resolve the FFmpeg binary once at startup and log it.
  ffmpegBinary = await resolveFfmpegBinary();

  await mongoose.connect(MONGODB_URI!);

  log("INFO", "Connected to MongoDB", {
    worker: WORKER_ID,
    recordingsDir: RECORDINGS_DIR,
    pollIntervalMs: pollMs,
    storage: "Backblaze B2",
    bucket: B2_BUCKET_NAME,
    region: B2_REGION,
    mode: WORKER_MODE,
    ffmpegBinary,
  });

  // Run the first schedule check immediately.
  await pollSchedules();

  log("INFO", "Worker polling started", {
    mode: WORKER_MODE,
    pollIntervalMs: pollMs,
  });

  // Continue checking every pollMs milliseconds.
  pollTimer = setInterval(() => {
    void pollSchedules();
  }, pollMs);

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch(async (error) => {
  log("ERROR", "Worker failed to start", {
    error: error instanceof Error ? error.message : String(error),
  });

  await mongoose.disconnect().catch(() => undefined);
  b2.destroy();
  process.exit(1);
});