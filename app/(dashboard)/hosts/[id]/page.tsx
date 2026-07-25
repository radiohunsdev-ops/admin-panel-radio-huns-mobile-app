/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Languages,
  Globe,
  Star,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

import { COLORS } from "@/constants/colors";

import { PageHeader } from "@/common/PageHeader";
import { StatusBadge } from "@/common/StatusBadge";
import { SectionTitle } from "@/common/SectionTitle";
import { InfoTile } from "@/common/InfoTile";

import { getHostById } from "@/lib/hostApi";
import { Card } from "@/common/card";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HostDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const host =
    await getHostById(id);

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Host Details"
        subtitle="View complete host information."
        backHref="/hosts"
        actions={
          <Link
            href={`/hosts/${host._id}/edit`}
            className="flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor:
                COLORS.primary,
              color:
                COLORS.background,
            }}
          >
            <Edit size={18} />
            Edit Host
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 xl:col-span-2">
          {/* Profile */}
          <Card>
            <div className="flex flex-col gap-6 md:flex-row">
              <div
                className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl"
                style={{
                  backgroundColor:
                    COLORS.softCard,
                }}
              >
                {host.profileImage ? (
                  <img
                    src={
                      host.profileImage
                    }
                    alt={
                      host.fullName
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User
                    size={50}
                    color={
                      COLORS.primary
                    }
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className="text-3xl font-bold"
                    style={{
                      color:
                        COLORS.text,
                    }}
                  >
                    {host.fullName}
                  </h2>

                  <StatusBadge
                    status={
                      host.isActive
                        ? "active"
                        : "inactive"
                    }
                  />

                  {host.isFeatured && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold uppercase"
                      style={{
                        backgroundColor:
                          COLORS.softCard,
                        color:
                          COLORS.primary,
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                {host.bio && (
                  <p
                    className="mt-4"
                    style={{
                      color:
                        COLORS.muted,
                    }}
                  >
                    {host.bio}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Information */}
          <Card>
            <SectionTitle title="Host Information" />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Mail
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Email"
                value={
                  host.email ||
                  "N/A"
                }
              />

              <InfoTile
                icon={
                  <Phone
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Phone"
                value={
                  host.phone ||
                  "N/A"
                }
              />

              <InfoTile
                icon={
                  <MapPin
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="City"
                value={
                  host.city ||
                  "N/A"
                }
              />

              <InfoTile
                icon={
                  <Languages
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Languages"
                value={
                  host.languages
                    ?.length
                    ? host.languages.join(
                        ", "
                      )
                    : "N/A"
                }
              />
            </div>
          </Card>

          {/* Cover Image */}
          {host.coverImage && (
            <Card>
              <SectionTitle title="Cover Image" />

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={
                    host.coverImage
                  }
                  alt={
                    host.fullName
                  }
                  className="h-72 w-full object-cover"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <SectionTitle title="Status" />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Star
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Featured"
                value={
                  host.isFeatured
                    ? "Yes"
                    : "No"
                }
              />

              <InfoTile
                icon={
                  <User
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Active"
                value={
                  host.isActive
                    ? "Yes"
                    : "No"
                }
              />
            </div>
          </Card>

          {/* Specialties */}
          <Card>
            <SectionTitle title="Specialties" />

            <div className="flex flex-wrap gap-2">
              {host.specialties
                ?.length ? (
                host.specialties.map(
                  (
                    specialty
                  ) => (
                    <span
                      key={
                        specialty
                      }
                      className="rounded-full px-3 py-1 text-sm"
                      style={{
                        backgroundColor:
                          COLORS.softCard,
                        color:
                          COLORS.primary,
                      }}
                    >
                      {
                        specialty
                      }
                    </span>
                  )
                )
              ) : (
                <span
                  style={{
                    color:
                      COLORS.muted,
                  }}
                >
                  No specialties
                </span>
              )}
            </div>
          </Card>

          {/* Social Links */}
          <Card>
            <SectionTitle title="Social Links" />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Globe
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Website"
                value={
                  host
                    .socialLinks
                    ?.website ||
                  "N/A"
                }
              />

              <InfoTile
                icon={
                  <ImageIcon
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Instagram"
                value={
                  host
                    .socialLinks
                    ?.instagram ||
                  "N/A"
                }
              />

              <InfoTile
                icon={
                  <ImageIcon
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Facebook"
                value={
                  host
                    .socialLinks
                    ?.facebook ||
                  "N/A"
                }
              />

              <InfoTile
                icon={
                  <ImageIcon
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Twitter"
                value={
                  host
                    .socialLinks
                    ?.twitter ||
                  "N/A"
                }
              />

              <InfoTile
                icon={
                  <ImageIcon
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="YouTube"
                value={
                  host
                    .socialLinks
                    ?.youtube ||
                  "N/A"
                }
              />
            </div>
          </Card>

          {/* Dates */}
          <Card>
            <SectionTitle title="Dates" />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Calendar
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Created At"
                value={new Date(
                  host.createdAt
                ).toLocaleString()}
              />

              <InfoTile
                icon={
                  <Calendar
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Updated At"
                value={new Date(
                  host.updatedAt
                ).toLocaleString()}
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}