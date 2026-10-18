
import {
  ArchivedShow,
} from "@/lib/archiveApi";

import {
  ArchivedShowFormData,
} from "./ArchivedShowFormFields";

export function mapArchivedShowToForm(
  episode: ArchivedShow,
): ArchivedShowFormData {
  const broadcastDate = new Date(episode.broadcastDate);

  const dateTimeLocal = Number.isNaN(broadcastDate.getTime())
    ? ""
    : new Date(
        broadcastDate.getTime() -
          broadcastDate.getTimezoneOffset() * 60_000,
      )
        .toISOString()
        .slice(0, 16);

  return {
    show:
      typeof episode.show === "string"
        ? episode.show
        : episode.show._id,

    schedule: episode.schedule,
    title: episode.title ?? "",
    description: episode.description ?? "",
    host: episode.host ?? "",
    broadcastDate: dateTimeLocal,
    durationSeconds: String(episode.durationSeconds ?? ""),
    audioUrl: episode.audioUrl ?? "",
    storageKey: episode.storageKey ?? "",
    artworkUrl: episode.artworkUrl ?? "",
    status: episode.status,
  };
}
