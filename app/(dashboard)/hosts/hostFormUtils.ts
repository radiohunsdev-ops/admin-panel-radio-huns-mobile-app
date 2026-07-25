import { Host } from "@/lib/hostApi";
import { HostFormData } from "./HostFormFields";

export const mapHostToForm = (
  host: Host,
): HostFormData => ({
  fullName: host.fullName || "",

  bio: host.bio || "",

  profileImage: host.profileImage || "",

  coverImage: host.coverImage || "",

  email: host.email || "",

  phone: host.phone || "",

  city: host.city || "",

  languages: host.languages?.join(", ") || "",

  specialties: host.specialties?.join(", ") || "",

  instagram: host.socialLinks?.instagram || "",

  facebook: host.socialLinks?.facebook || "",

  twitter: host.socialLinks?.twitter || "",

  youtube: host.socialLinks?.youtube || "",

  website: host.socialLinks?.website || "",

  isFeatured: String(host.isFeatured ?? false),

  isActive: String(host.isActive ?? true),
});