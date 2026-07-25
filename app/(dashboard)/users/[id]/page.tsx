import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckCircle,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";

import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import { InfoTile } from "@/common/InfoTile";
import { PageHeader } from "@/common/PageHeader";
import { SectionTitle } from "@/common/SectionTitle";
import { StatusBadge } from "@/common/StatusBadge";
import { getUserById } from "@/lib/userApi";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Icon = {
  user: <User size={20} color={COLORS.primary} />,
  mail: <Mail size={20} color={COLORS.primary} />,
  phone: <Phone size={20} color={COLORS.primary} />,
  map: <MapPin size={20} color={COLORS.primary} />,
  shield: <Shield size={20} color={COLORS.primary} />,
  bell: <Bell size={20} color={COLORS.primary} />,
  calendar: <Calendar size={20} color={COLORS.primary} />,
  check: <CheckCircle size={20} color={COLORS.primary} />,
};

export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  const basicInfo = [
    { label: "Full Name", value: user.fullName, icon: Icon.user },
    { label: "Email", value: user.email, icon: Icon.mail },
    { label: "Phone", value: user.phone || "N/A", icon: Icon.phone },
    { label: "Role", value: user.role, icon: Icon.shield },
  ];

  const locationInfo = [
    { label: "City", value: user.city || "N/A", icon: Icon.map },
    { label: "Region", value: user.region || "N/A", icon: Icon.map },
    {
      label: "Preferred Language",
      value: user.preferredLanguage || "N/A",
      icon: Icon.user,
    },
  ];

  const accountInfo = [
    {
      label: "Email Verified",
      value: user.emailVerified ? "Verified" : "Not Verified",
      icon: Icon.check,
    },
    {
      label: "Provider",
      value: user.provider,
      icon: Icon.shield,
    },
  ];

  const notifications = [
    {
      label: "15 Min Reminder",
      value: user.notificationPreferences?.showReminder15Min
        ? "Enabled"
        : "Disabled",
    },
    {
      label: "30 Min Reminder",
      value: user.notificationPreferences?.showReminder30Min
        ? "Enabled"
        : "Disabled",
    },
    {
      label: "Giveaway Alerts",
      value: user.notificationPreferences?.giveawayAlerts
        ? "Enabled"
        : "Disabled",
    },
    {
      label: "News Alerts",
      value: user.notificationPreferences?.newsAlerts ? "Enabled" : "Disabled",
    },
  ];

  const dates = [
    {
      label: "Created At",
      value: new Date(user.createdAt).toLocaleString(),
    },
    {
      label: "Updated At",
      value: new Date(user.updatedAt).toLocaleString(),
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="User Details"
        subtitle="View complete user information."
        backHref="/users"
        actions={
          <Link
            href={`/users/${user._id}/edit`}
            className="flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.background,
            }}
          >
            <Edit size={18} />
            Edit User
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <div className="flex flex-col gap-6 md:flex-row">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-3xl"
                style={{ backgroundColor: COLORS.softCard }}
              >
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.fullName}
                    width={112}
                    height={112}
                    className="h-full w-ful rounded-2xl object-cover"
                    unoptimized
                  />
                ) : (
                  <User size={50} color={COLORS.primary} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: COLORS.text }}
                  >
                    {user.fullName}
                  </h2>

                  <StatusBadge
                    status={user.emailVerified ? "published" : "draft"}
                  />
                </div>

                <p className="mt-3" style={{ color: COLORS.muted }}>
                  {user.email}
                </p>

                <p
                  className="mt-1 capitalize"
                  style={{ color: COLORS.secondary }}
                >
                  {user.role}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Basic Information" />
            <div className="space-y-4">
              {basicInfo.map((item) => (
                <InfoTile key={item.label} {...item} />
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Location & Language" />
            <div className="space-y-4">
              {locationInfo.map((item) => (
                <InfoTile key={item.label} {...item} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Account Settings" />
            <div className="space-y-4">
              {accountInfo.map((item) => (
                <InfoTile key={item.label} {...item} />
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Notification Preferences" />
            <div className="space-y-4">
              {notifications.map((item) => (
                <InfoTile
                  key={item.label}
                  icon={Icon.bell}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Dates" />
            <div className="space-y-4">
              {dates.map((item) => (
                <InfoTile
                  key={item.label}
                  icon={Icon.calendar}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
