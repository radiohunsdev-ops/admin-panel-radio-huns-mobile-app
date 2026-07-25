import { Show } from "@/lib/showApi";
import { INITIAL_FORM, ShowFormData, serializeForm } from "./ShowFormFields";


export function mapShowToForm(show: Show): ShowFormData {
  return {
    ...INITIAL_FORM,

    showName: show.showName || "",

    shortTitle: show.shortTitle || "",

    description: show.description || "",

    host:
      typeof show.host === "string"
        ? show.host
        : show.host?._id || "",

    station: show.station || "",

    language: show.language || "English",

    genre: show.genre || "",

    tags: show.tags?.join(", ") || "",

    coverImage: show.coverImage || "",

    isLive: String(show.isLive ?? false),

    isFeatured: String(show.isFeatured ?? false),

    showOnHome: String(show.showOnHome ?? true),

    allowSubscriptions: String(
      show.allowSubscriptions ?? true,
    ),

    enableComments: String(
      show.enableComments ?? true,
    ),

    status: show.status || "active",
  };
}

export function serializeShowForm(
  formData: ShowFormData,
) {
  return serializeForm(formData);
}