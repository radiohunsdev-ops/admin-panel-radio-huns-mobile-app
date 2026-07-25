import { getUserById } from "@/lib/userApi";
import {
  INITIAL_USER_FORM,
  UserFormData,
} from "./UserFromFields";

type User = Awaited<ReturnType<typeof getUserById>>;

/**
 * Convert API response to form values
 */
export function mapUserToForm(user: User): UserFormData {
  return {
    ...INITIAL_USER_FORM,

    fullName: user.fullName || "",

    email: user.email || "",

    phone: user.phone || "",

    password: "",

    role: user.role || "user",

    preferredLanguage:
      user.preferredLanguage || "",

    city: user.city || "",

    region: user.region || "",

    provider:
      user.provider || "email",

    emailVerified: String(
      user.emailVerified,
    ),

    showReminder15Min: String(
      user.notificationPreferences
        ?.showReminder15Min ?? true,
    ),

    showReminder30Min: String(
      user.notificationPreferences
        ?.showReminder30Min ?? false,
    ),

    giveawayAlerts: String(
      user.notificationPreferences
        ?.giveawayAlerts ?? true,
    ),

    newsAlerts: String(
      user.notificationPreferences
        ?.newsAlerts ?? true,
    ),
  };
}

/**
 * Convert form values to API payload
 */
export function serializeUserForm(
  formData: UserFormData,
) {
  return {
    fullName: formData.fullName,

    email: formData.email,

    phone:
      formData.phone || undefined,

    password:
      formData.password.trim() ||
      undefined,

    role: formData.role,

    preferredLanguage:
      formData.preferredLanguage ||
      undefined,

    city:
      formData.city || undefined,

    region:
      formData.region || undefined,

    provider:
      formData.provider,

    emailVerified:
      formData.emailVerified ===
      "true",

    notificationPreferences: {
      showReminder15Min:
        formData.showReminder15Min ===
        "true",

      showReminder30Min:
        formData.showReminder30Min ===
        "true",

      giveawayAlerts:
        formData.giveawayAlerts ===
        "true",

      newsAlerts:
        formData.newsAlerts ===
        "true",
    },
  };
}