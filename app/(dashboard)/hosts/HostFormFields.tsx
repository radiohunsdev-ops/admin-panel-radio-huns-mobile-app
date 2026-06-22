"use client";

import React from "react";
import {
  User,
  Image as ImageIcon,
  Globe,
  Settings,
} from "lucide-react";

import { COLORS } from "@/constants/colors";
import { SectionTitle } from "@/common/SectionTitle";
import { FormField } from "@/common/FormField";

export interface HostFormData {
  fullName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  email: string;
  phone: string;
  city: string;

  languages: string;
  specialties: string;

  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  website: string;

  isFeatured: string;
  isActive: string;
}

export const INITIAL_FORM: HostFormData = {
  fullName: "",
  bio: "",
  profileImage: "",
  coverImage: "",
  email: "",
  phone: "",
  city: "",

  languages: "",
  specialties: "",

  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
  website: "",

  isFeatured: "false",
  isActive: "true",
};

export function serializeForm(
  form: HostFormData
) {
  return {
    fullName: form.fullName,
    bio: form.bio,
    profileImage: form.profileImage,
    coverImage: form.coverImage,
    email: form.email,
    phone: form.phone,
    city: form.city,

    languages: form.languages
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),

    specialties: form.specialties
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),

    socialLinks: {
      instagram: form.instagram,
      facebook: form.facebook,
      twitter: form.twitter,
      youtube: form.youtube,
      website: form.website,
    },

    isFeatured:
      form.isFeatured === "true",

    isActive:
      form.isActive === "true",
  };
}

const BOOLEAN_OPTIONS = [
  {
    value: "true",
    label: "Yes",
  },
  {
    value: "false",
    label: "No",
  },
];

type ChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLTextAreaElement |
    HTMLSelectElement
  >
) => void;

interface HostFormFieldsProps {
  formData: HostFormData;
  onChange: ChangeHandler;
}

export default function HostFormFields({
  formData,
  onChange,
}: HostFormFieldsProps) {
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle
          title="Basic Information"
          subtitle="Host profile details."
          icon={
            <User
              size={20}
              color={COLORS.primary}
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            required
            placeholder="RJ Ankit"
          />

          <FormField
            label="Email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="host@example.com"
          />

          <FormField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="+91 9876543210"
          />

          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={onChange}
            placeholder="Delhi"
          />
        </div>

        <div className="mt-5">
          <FormField
            as="textarea"
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={onChange}
            placeholder="Tell us about the host..."
          />
        </div>
      </section>

      {/* Images */}
      <section>
        <SectionTitle
          title="Images"
          subtitle="Profile and cover images."
          icon={
            <ImageIcon
              size={20}
              color={COLORS.primary}
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Profile Image URL"
            name="profileImage"
            value={formData.profileImage}
            onChange={onChange}
            placeholder="https://..."
          />

          <FormField
            label="Cover Image URL"
            name="coverImage"
            value={formData.coverImage}
            onChange={onChange}
            placeholder="https://..."
          />
        </div>
      </section>

      {/* Expertise */}
      <section>
        <SectionTitle
          title="Languages & Specialties"
          subtitle="Host expertise information."
          icon={
            <Globe
              size={20}
              color={COLORS.primary}
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Languages"
            name="languages"
            value={formData.languages}
            onChange={onChange}
            placeholder="English, Hindi"
          />

          <FormField
            label="Specialties"
            name="specialties"
            value={formData.specialties}
            onChange={onChange}
            placeholder="Radio, Podcast, Music"
          />
        </div>
      </section>

      {/* Social Links */}
      <section>
        <SectionTitle
          title="Social Links"
          subtitle="Host social media profiles."
          icon={
            <Globe
              size={20}
              color={COLORS.primary}
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Instagram"
            name="instagram"
            value={formData.instagram}
            onChange={onChange}
          />

          <FormField
            label="Facebook"
            name="facebook"
            value={formData.facebook}
            onChange={onChange}
          />

          <FormField
            label="Twitter / X"
            name="twitter"
            value={formData.twitter}
            onChange={onChange}
          />

          <FormField
            label="YouTube"
            name="youtube"
            value={formData.youtube}
            onChange={onChange}
          />

          <FormField
            label="Website"
            name="website"
            value={formData.website}
            onChange={onChange}
          />
        </div>
      </section>

      {/* Settings */}
      <section>
        <SectionTitle
          title="Settings"
          subtitle="Host visibility settings."
          icon={
            <Settings
              size={20}
              color={COLORS.primary}
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            as="select"
            label="Featured Host"
            name="isFeatured"
            value={formData.isFeatured}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Active"
            name="isActive"
            value={formData.isActive}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />
        </div>
      </section>
    </div>
  );
}