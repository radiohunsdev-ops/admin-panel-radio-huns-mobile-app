import Link from "next/link";
import {
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { COLORS } from "@/constants/colors";
import { PageHeader } from "@/common/PageHeader";
import { StatusBadge } from "@/common/StatusBadge";
import { SectionTitle } from "@/common/SectionTitle";
import { Card } from "@/common/card";
import { InfoTile } from "@/common/InfoTile";
import { getUserById } from "@/lib/userApi";
interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getUserById(id);
  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {" "}
      {/* HEADER */}{" "}
      <PageHeader
        title="User Details"
        subtitle="View complete user information."
        backHref="/users"
        actions={
          <Link
            href={`/users/${user._id}/edit`}
            className="flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.background,
            }}
          >
            {" "}
            <Edit size={18} /> Edit User{" "}
          </Link>
        }
      />{" "}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {" "}
        {/* LEFT SIDE */}{" "}
        <div className="space-y-6 xl:col-span-2">
          {" "}
          {/* USER CARD */}{" "}
          <Card>
            {" "}
            <div className="flex flex-col gap-6 md:flex-row">
              {" "}
              <div
                className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl"
                style={{ backgroundColor: COLORS.softCard }}
              >
                {" "}
                <User size={50} color={COLORS.primary} />{" "}
              </div>{" "}
              <div className="flex-1">
                {" "}
                <div className="flex flex-wrap items-center gap-3">
                  {" "}
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: COLORS.text }}
                  >
                    {" "}
                    {user.fullName}{" "}
                  </h2>{" "}
                  <StatusBadge
                    status={user.emailVerified ? "published" : "draft"}
                  />{" "}
                </div>{" "}
                <p className="mt-3" style={{ color: COLORS.muted }}>
                  {" "}
                  {user.email}{" "}
                </p>{" "}
                <p
                  className="mt-1 capitalize"
                  style={{ color: COLORS.secondary }}
                >
                  {" "}
                  {user.role}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </Card>{" "}
          {/* BASIC INFO */}{" "}
          <Card>
            {" "}
            <SectionTitle title="Basic Information" />{" "}
            <div className="space-y-4">
              {" "}
              <InfoTile
                icon={<User size={20} color={COLORS.primary} />}
                label="Full Name"
                value={user.fullName}
              />{" "}
              <InfoTile
                icon={<Mail size={20} color={COLORS.primary} />}
                label="Email"
                value={user.email}
              />{" "}
              <InfoTile
                icon={<Phone size={20} color={COLORS.primary} />}
                label="Phone"
                value={user.phone || "N/A"}
              />{" "}
              <InfoTile
                icon={<Shield size={20} color={COLORS.primary} />}
                label="Role"
                value={user.role}
              />{" "}
            </div>{" "}
          </Card>{" "}
          {/* LOCATION */}{" "}
          <Card>
            {" "}
            <SectionTitle title="Location & Language" />{" "}
            <div className="space-y-4">
              {" "}
              <InfoTile
                icon={<MapPin size={20} color={COLORS.primary} />}
                label="City"
                value={user.city || "N/A"}
              />{" "}
              <InfoTile
                icon={<MapPin size={20} color={COLORS.primary} />}
                label="Region"
                value={user.region || "N/A"}
              />{" "}
              <InfoTile
                icon={<User size={20} color={COLORS.primary} />}
                label="Preferred Language"
                value={user.preferredLanguage || "N/A"}
              />{" "}
            </div>{" "}
          </Card>{" "}
        </div>{" "}
        {/* RIGHT SIDEBAR */}{" "}
        <div className="space-y-6">
          {" "}
          {/* ACCOUNT */}{" "}
          <Card>
            {" "}
            <SectionTitle title="Account Settings" />{" "}
            <div className="space-y-4">
              {" "}
              <InfoTile
                icon={<CheckCircle size={20} color={COLORS.primary} />}
                label="Email Verified"
                value={user.emailVerified ? "Verified" : "Not Verified"}
              />{" "}
              <InfoTile
                icon={<Shield size={20} color={COLORS.primary} />}
                label="Provider"
                value={user.provider}
              />{" "}
            </div>{" "}
          </Card>{" "}
          {/* NOTIFICATIONS */}{" "}
          <Card>
            {" "}
            <SectionTitle title="Notification Preferences" />{" "}
            <div className="space-y-4">
              {" "}
              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="15 Min Reminder"
                value={
                  user.notificationPreferences?.showReminder15Min
                    ? "Enabled"
                    : "Disabled"
                }
              />{" "}
              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="30 Min Reminder"
                value={
                  user.notificationPreferences?.showReminder30Min
                    ? "Enabled"
                    : "Disabled"
                }
              />{" "}
              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="Giveaway Alerts"
                value={
                  user.notificationPreferences?.giveawayAlerts
                    ? "Enabled"
                    : "Disabled"
                }
              />{" "}
              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="News Alerts"
                value={
                  user.notificationPreferences?.newsAlerts
                    ? "Enabled"
                    : "Disabled"
                }
              />{" "}
            </div>{" "}
          </Card>{" "}
          {/* DATES */}{" "}
          <Card>
            {" "}
            <SectionTitle title="Dates" />{" "}
            <div className="space-y-4">
              {" "}
              <InfoTile
                icon={<Calendar size={20} color={COLORS.primary} />}
                label="Created At"
                value={new Date(user.createdAt).toLocaleString()}
              />{" "}
              <InfoTile
                icon={<Calendar size={20} color={COLORS.primary} />}
                label="Updated At"
                value={new Date(user.updatedAt).toLocaleString()}
              />{" "}
            </div>{" "}
          </Card>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
