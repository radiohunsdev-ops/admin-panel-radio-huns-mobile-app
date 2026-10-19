import "dotenv/config";
import "../models/show";
import mongoose from "mongoose";
import { DateTime } from "luxon";
import http, { type IncomingMessage } from "node:http";
import https from "node:https";
import { PassThrough } from "node:stream";
import { randomUUID } from "node:crypto";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
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

type AudioFormat = {
  ext: string;
  contentType: string;
};

type ActiveJob = {
  key: string;
  scheduleId: string;
  showId: string;
  broadcastStart: Date;
  plannedEnd: Date;
  startedAt: Date;
  title: string;
  host: string;
  artworkUrl: string;
  abort: AbortController;
  bytes: number;
  connectedMs: number;
  done: Promise<void> | null;
};

const {
  MONGODB_URI,
  B2_ENDPOINT,
  B2_REGION,
  B2_BUCKET_NAME,
  B2_KEY_ID,
  B2_APPLICATION_KEY,
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

const CONNECT_IDLE_TIMEOUT_MS = 15_000; // no data for this long = dead stream
const RECONNECT_DELAY_MS = 2_000;
const MIN_RECORDING_BYTES = 16_000;
const MAX_REDIRECTS = 5;
const SHUTDOWN_WAIT_MS = 30_000;

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

const errMsg = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
      return { start: startDate, end: endDate, timezone };
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

/**
 * Priority:
 * 1. Schedule.linkedStream
 * 2. Schedule.backupStream
 * 3. Active station's streamUrl
 * 4. Active station's backupStreamUrl
 */
async function getStreamCandidates(
  schedule: ScheduleDocument,
): Promise<StreamCandidate[]> {
  const activeStation = (await LiveStream.findOne({ isActive: true })
    .sort({ createdAt: 1 })
    .lean()) as unknown as LiveStreamDocument | null;

  const candidates: StreamCandidate[] = [
    { url: schedule.linkedStream?.trim() ?? "", source: "linkedStream" },
    { url: schedule.backupStream?.trim() ?? "", source: "backupStream" },
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

/* -------------------------------------------------------------------------- */
/*  Node.js stream capture (replaces FFmpeg)                                  */
/* -------------------------------------------------------------------------- */

/**
 * Maps the server's Content-Type to a file format.
 * Streams are stored as-is (no transcoding), so only plain audio
 * streams (Icecast / Shoutcast style MP3, AAC, Ogg) are supported.
 */
function detectFormat(contentType: string | undefined): AudioFormat {
  const type = (contentType ?? "").split(";")[0]!.trim().toLowerCase();

  if (type === "audio/mpeg" || type === "audio/mp3") {
    return { ext: "mp3", contentType: "audio/mpeg" };
  }
  if (type === "audio/aac" || type === "audio/aacp") {
    return { ext: "aac", contentType: "audio/aac" };
  }
  if (type === "audio/ogg" || type === "application/ogg") {
    return { ext: "ogg", contentType: "audio/ogg" };
  }

  if (
    type.includes("mpegurl") || // HLS playlists
    type.startsWith("text/") ||
    type === "application/json"
  ) {
    throw new Error(
      `Unsupported stream type "${type}" (HLS/playlist/web page). ` +
        `Use a direct audio stream URL.`,
    );
  }

  // Many radio servers send nothing useful. Assume MP3.
  return { ext: "mp3", contentType: "audio/mpeg" };
}

/**
 * Opens a live HTTP audio stream. Uses node:http(s) instead of fetch because
 * Shoutcast v1 servers reply with "ICY 200 OK", which fetch rejects.
 * Follows redirects and asks for no inline ICY metadata, which would
 * otherwise corrupt the saved audio.
 */
function openAudioStream(
  url: string,
  signal: AbortSignal,
  redirects = 0,
): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      reject(new Error(`Invalid stream URL: ${url}`));
      return;
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      reject(new Error(`Unsupported protocol ${parsed.protocol}`));
      return;
    }

    const client = parsed.protocol === "https:" ? https : http;

    const req = client.get(
      parsed,
      {
        signal,
        headers: {
          "User-Agent": "RadioHunsRecorder/1.0",
          Accept: "*/*",
          "Icy-MetaData": "0",
          Connection: "close",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;

        if ([301, 302, 303, 307, 308].includes(status)) {
          res.resume();
          const location = res.headers.location;

          if (!location) {
            reject(new Error(`Redirect ${status} without Location header`));
            return;
          }
          if (redirects >= MAX_REDIRECTS) {
            reject(new Error("Too many redirects"));
            return;
          }

          openAudioStream(
            new URL(location, parsed).toString(),
            signal,
            redirects + 1,
          ).then(resolve, reject);
          return;
        }

        if (status !== 200) {
          res.resume();
          reject(new Error(`Stream responded with HTTP ${status}`));
          return;
        }

        resolve(res);
      },
    );

    // Covers both connect time and mid-stream silence (socket idle timeout).
    req.setTimeout(CONNECT_IDLE_TIMEOUT_MS, () => {
      req.destroy(new Error("Stream connection timed out / went silent"));
    });

    req.once("error", reject);
  });
}

/**
 * Pipes a live response into the shared sink WITHOUT ending the sink, so a
 * reconnect (or backup stream) continues the same recording.
 * Honors backpressure. Resolves when the stream ends, drops, or is aborted.
 */
function pumpInto(
  res: IncomingMessage,
  sink: PassThrough,
  job: ActiveJob,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const connectedAt = Date.now();
    let settled = false;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      job.connectedMs += Date.now() - connectedAt;
      sink.off("drain", onDrain);

      if (error && !job.abort.signal.aborted) reject(error);
      else resolve();
    };

    const onDrain = () => res.resume();

    res.on("data", (chunk: Buffer) => {
      job.bytes += chunk.length;
      if (!sink.write(chunk)) {
        res.pause();
        sink.once("drain", onDrain);
      }
    });

    res.once("end", () => finish());
    res.once("close", () => finish());
    res.once("error", (error) => finish(error));
    sink.once("error", (error) => {
      res.destroy();
      finish(error);
    });
  });
}

/* -------------------------------------------------------------------------- */

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

  const cooldownUntil = failureCooldowns.get(key);
  if (cooldownUntil !== undefined) {
    if (Date.now() < cooldownUntil) return;
    failureCooldowns.delete(key);
  }

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

  const title = String(show.showName || show.shortTitle || "Radio Huns Show");

  const job: ActiveJob = {
    key,
    scheduleId,
    showId,
    broadcastStart: window.start,
    plannedEnd: window.end,
    startedAt: new Date(),
    title,
    host: typeof show.host === "string" ? show.host : "",
    artworkUrl: String(show.coverImage || ""),
    abort: new AbortController(),
    bytes: 0,
    connectedMs: 0,
    done: null,
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

  job.done = finishRecording(job, candidates);
}

async function finishRecording(job: ActiveJob, candidates: StreamCandidate[]) {
  const sources = new Set<string>();

  let format: AudioFormat | undefined;
  let storageKey = "";
  let sink: PassThrough | undefined;
  let upload: Upload | undefined;
  let uploadDone: Promise<unknown> | undefined;

  // Stop capturing at the scheduled end time.
  const stopTimer = setTimeout(
    () => job.abort.abort(),
    Math.max(0, job.plannedEnd.getTime() - Date.now()),
  );

  try {
    let failedAttemptsBeforeStart = 0;

    capture: while (
      !job.abort.signal.aborted &&
      Date.now() < job.plannedEnd.getTime() - 1000
    ) {
      let gotStream = false;

      for (const candidate of candidates) {
        if (
          job.abort.signal.aborted ||
          Date.now() >= job.plannedEnd.getTime() - 1000
        ) {
          break capture;
        }

        try {
          const res = await openAudioStream(candidate.url, job.abort.signal);
          const detected = detectFormat(res.headers["content-type"]);

          if (format && format.ext !== detected.ext) {
            res.destroy();
            throw new Error(
              `Format mismatch: recording is ${format.ext}, ` +
                `${candidate.source} is ${detected.ext}`,
            );
          }

          // First successful connection decides the file format
          // and starts the streaming upload to B2.
          if (!format) {
            format = detected;

            storageKey =
              `archives/${job.showId}/${job.scheduleId}/` +
              `${job.broadcastStart.toISOString().slice(0, 10)}/` +
              `${safeSlug(job.title)}-` +
              `${job.broadcastStart.toISOString().replace(/[:.]/g, "-")}-` +
              `${randomUUID()}.${format.ext}`;

            sink = new PassThrough({ highWaterMark: 1024 * 1024 });

            upload = new Upload({
              client: b2,
              params: {
                Bucket: B2_BUCKET_NAME!,
                Key: storageKey,
                Body: sink,
                ContentType: format.contentType,
                CacheControl: "private, no-store",
              },
              queueSize: 3,
              partSize: 5 * 1024 * 1024,
              leavePartsOnError: false,
            });

            uploadDone = upload.done();
            // Avoid an unhandled rejection before we await it below.
            uploadDone.catch(() => undefined);
          }

          sources.add(candidate.source);
          gotStream = true;

          log("INFO", "Connected to stream", {
            scheduleId: job.scheduleId,
            source: candidate.source,
            contentType: res.headers["content-type"],
            bitrate: res.headers["icy-br"],
          });

          await pumpInto(res, sink!, job);

          log("WARN", "Stream ended before scheduled end; reconnecting", {
            scheduleId: job.scheduleId,
            source: candidate.source,
          });
        } catch (error) {
          if (job.abort.signal.aborted) break capture;

          log("WARN", "Stream attempt failed", {
            scheduleId: job.scheduleId,
            source: candidate.source,
            error: errMsg(error),
          });
        }
      }

      if (!format) {
        failedAttemptsBeforeStart++;
        // Nothing ever connected: give up after a few full passes.
        if (failedAttemptsBeforeStart >= 3) {
          throw new Error("All stream sources failed to connect");
        }
      }

      if (!gotStream || !job.abort.signal.aborted) {
        await sleep(RECONNECT_DELAY_MS);
      }
    }

    if (!sink || !upload || !uploadDone || !format) {
      throw new Error("No audio was captured");
    }

    if (job.bytes < MIN_RECORDING_BYTES) {
      await upload.abort();
      sink.destroy();
      throw new Error(`Recording too small (${job.bytes} bytes)`);
    }

    // Finish the upload (completes the multipart upload).
    sink.end();
    await uploadDone;

    const durationSeconds = Math.max(1, Math.round(job.connectedMs / 1000));

    const audioUrl = await getSignedUrl(
      b2,
      new GetObjectCommand({ Bucket: B2_BUCKET_NAME!, Key: storageKey }),
      { expiresIn: SIGNED_URL_SECONDS },
    );

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
      sources: [...sources],
      bytes: job.bytes,
      durationSeconds,
      playbackUrlExpiresInSeconds: SIGNED_URL_SECONDS,
    });
  } catch (error) {
    // Discard any half-finished multipart upload.
    try {
      await upload?.abort();
    } catch {
      // ignore
    }
    sink?.destroy();

    failureCooldowns.set(job.key, Date.now() + FAILURE_COOLDOWN_MS);

    log("ERROR", "Recording job failed", {
      title: job.title,
      scheduleId: job.scheduleId,
      retryInSeconds: FAILURE_COOLDOWN_MS / 1000,
      error: errMsg(error),
    });
  } finally {
    clearTimeout(stopTimer);
    activeJobs.delete(job.key);
  }
}

async function pollSchedules() {
  if (pollRunning || shuttingDown) return;

  pollRunning = true;

  try {
    const now = new Date();

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
          error: errMsg(error),
        });
      }
    }
  } catch (error) {
    log("ERROR", "Schedule polling failed", { error: errMsg(error) });
  } finally {
    pollRunning = false;
  }
}

async function shutdown(signal: string) {
  if (shuttingDown) return;

  shuttingDown = true;

  if (pollTimer) clearInterval(pollTimer);

  log("WARN", `Received ${signal}; finalizing active recordings`, {
    activeJobs: activeJobs.size,
  });

  // Aborting stops the capture; finishRecording() then completes the upload
  // so the partial show is still archived instead of lost.
  const pending: Promise<void>[] = [];
  for (const job of activeJobs.values()) {
    job.abort.abort();
    if (job.done) pending.push(job.done);
  }

  await Promise.race([Promise.allSettled(pending), sleep(SHUTDOWN_WAIT_MS)]);

  await mongoose.disconnect();
  b2.destroy();
  process.exit(0);
}

async function main() {
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  await mongoose.connect(MONGODB_URI!);

  log("INFO", "Connected to MongoDB", {
    worker: WORKER_ID,
    pollIntervalMs: pollMs,
    capture: "node-streams",
    storage: "Backblaze B2 (streaming multipart upload)",
    bucket: B2_BUCKET_NAME,
    region: B2_REGION,
    mode: WORKER_MODE,
  });

  await pollSchedules();

  log("INFO", "Worker polling started", {
    mode: WORKER_MODE,
    pollIntervalMs: pollMs,
  });

  pollTimer = setInterval(() => {
    void pollSchedules();
  }, pollMs);
}

main().catch(async (error) => {
  log("ERROR", "Worker failed to start", { error: errMsg(error) });

  await mongoose.disconnect().catch(() => undefined);
  b2.destroy();
  process.exit(1);
});