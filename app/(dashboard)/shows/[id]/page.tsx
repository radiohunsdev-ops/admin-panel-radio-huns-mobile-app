/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Edit,
  Radio,
  User,
  Building2,
  Languages,
  Tag,
  Calendar,
  Star,
  Home,
  MessageCircle,
  Bell,
} from "lucide-react";

import { COLORS } from "@/constants/colors";

import { PageHeader } from "@/common/PageHeader";
import { StatusBadge } from "@/common/StatusBadge";
import { SectionTitle } from "@/common/SectionTitle";
import { Card } from "@/common/card";
import { InfoTile } from "@/common/InfoTile";

import { getShowById } from "@/lib/showApi";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ShowDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const show = await getShowById(id);

  const hostName =
    typeof show.host === "string"
      ? show.host
      : show.host?.hostName || "N/A";

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Show Details"
        subtitle="View complete show information."
        backHref="/shows"
        actions={
          <Link
            href={`/shows/${show._id}/edit`}
            className="flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor:
                COLORS.primary,
              color:
                COLORS.background,
            }}
          >
            <Edit size={18} />
            Edit Show
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Content */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <div className="flex flex-col gap-6 md:flex-row">
              <div
                className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl"
                style={{
                  backgroundColor:
                    COLORS.softCard,
                }}
              >
                {show.coverImage ? (
                  <img
                    src={
                      show.coverImage
                    }
                    alt={
                      show.showName
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Radio
                    size={48}
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
                    {show.showName}
                  </h2>

                  {show.shortTitle && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold uppercase"
                      style={{
                        backgroundColor:
                          COLORS.softCard,
                        color:
                          COLORS.primary,
                      }}
                    >
                      {
                        show.shortTitle
                      }
                    </span>
                  )}

                  <StatusBadge
                    status={
                      show.status
                    }
                  />
                </div>

                <p
                  className="mt-3"
                  style={{
                    color:
                      COLORS.muted,
                  }}
                >
                  {
                    show.description
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle
              title="Show Information"
            />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <User
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Host"
                value={hostName}
              />

              <InfoTile
                icon={
                  <Building2
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Station"
                value={
                  show.station
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
                label="Language"
                value={
                  show.language
                }
              />

              <InfoTile
                icon={
                  <Tag
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Genre"
                value={
                  show.genre
                }
              />
            </div>
          </Card>

          {show.coverImage && (
            <Card>
              <SectionTitle title="Cover Image" />

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={
                    show.coverImage
                  }
                  alt={
                    show.showName
                  }
                  className="h-72 w-full object-cover"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <SectionTitle
              title="Settings"
            />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Radio
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Live Show"
                value={
                  show.isLive
                    ? "Yes"
                    : "No"
                }
              />

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
                  show.isFeatured
                    ? "Yes"
                    : "No"
                }
              />

              <InfoTile
                icon={
                  <Home
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Show On Home"
                value={
                  show.showOnHome
                    ? "Yes"
                    : "No"
                }
              />

              <InfoTile
                icon={
                  <Bell
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Allow Subscriptions"
                value={
                  show.allowSubscriptions
                    ? "Yes"
                    : "No"
                }
              />

              <InfoTile
                icon={
                  <MessageCircle
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Enable Comments"
                value={
                  show.enableComments
                    ? "Yes"
                    : "No"
                }
              />
            </div>
          </Card>

          <Card>
            <SectionTitle title="Tags" />

            <div className="flex flex-wrap gap-2">
              {show.tags?.length >
              0 ? (
                show.tags.map(
                  (
                    tag: string
                  ) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-sm"
                      style={{
                        backgroundColor:
                          COLORS.softCard,
                        color:
                          COLORS.primary,
                      }}
                    >
                      {tag}
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
                  No tags
                </span>
              )}
            </div>
          </Card>

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
                  show.createdAt
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
                  show.updatedAt
                ).toLocaleString()}
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}