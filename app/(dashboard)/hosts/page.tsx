import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Card } from "@/common/card";
import { StatusBadge } from "@/common/StatusBadge";
import { COLORS } from "@/constants/colors";
import { getHosts, Host } from "@/lib/hostApi";
import DataTable, {TableColumn} from "@/components/DataTable/DataTable";
import TableAvatar from "@/components/DataTable/TableAvatar";
import { ActionButtons } from "@/components/DataTable/ActionButtons";

export const dynamic = "force-dynamic";

export default async function HostsPage() {
  const hosts = await getHosts();

  const columns: TableColumn<Host>[] = [
    {
      header: "Host",
      render: (host) => (
        <div className="flex items-center gap-4">
          <TableAvatar
            image={host.profileImage}
            alt={host.fullName}
            size={48}
          />

          <div>
            <h3
              className="font-semibold"
              style={{ color: COLORS.text }}
            >
              {host.fullName}
            </h3>
          </div>
        </div>
      ),
    },

    {
      header: "City",
      render: (host) => (
        <span style={{ color: COLORS.text }}>
          {host.city || "N/A"}
        </span>
      ),
    },

    {
      header: "Featured",
      render: (host) => (
        <span
          className="text-sm font-medium"
          style={{
            color: host.isFeatured
              ? "#22c55e"
              : COLORS.muted,
          }}
        >
          {host.isFeatured ? "Featured" : "Normal"}
        </span>
      ),
    },

    {
      header: "Status",
      render: (host) => (
        <StatusBadge
          status={
            host.isActive ? "active" : "inactive"
          }
          size="sm"
        />
      ),
    },

    {
      header: "Actions",
      className: "text-right",
      render: (host) => (
        <ActionButtons
          viewUrl={`/hosts/${host._id}`}
          editUrl={`/hosts/${host._id}/edit`}
          deleteId={host._id}
          deleteType="host"
        />
      ),
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className="text-4xl font-bold"
            style={{ color: COLORS.text }}
          >
            Hosts
          </h1>

          <p
            className="mt-2"
            style={{ color: COLORS.muted }}
          >
            Manage radio hosts and presenters.
          </p>
        </div>

        <Link
          href="/hosts/create"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.background,
          }}
        >
          <Plus size={18} />
          Add Host
        </Link>
      </div>

      {/* Search */}
      <div
        className="mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3"
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        }}
      >
        <Search
          size={18}
          color={COLORS.muted}
        />

        <input
          type="text"
          placeholder="Search hosts..."
          className="w-full bg-transparent outline-none"
          style={{ color: COLORS.text }}
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <DataTable
          data={hosts}
          columns={columns}
          emptyMessage="No hosts found."
        />
      </Card>
    </main>
  );
}