import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Card } from "@/common/card";
import { COLORS } from "@/constants/colors";
import { getUsers, User as UserType } from "@/lib/userApi";
import { StatusBadge } from "@/common/StatusBadge";
import TableAvatar from "@/components/DataTable/TableAvatar";
import { ActionButtons } from "@/components/DataTable/ActionButtons";
import DataTable, { TableColumn } from "@/components/DataTable/DataTable";

export default async function UsersPage() {
  const users = await getUsers();

  const columns: TableColumn<UserType>[] = [
    {
      header: "User",
      render: (user) => (
        <div className="flex items-center gap-4">
          <TableAvatar
            image={user.profileImage}
            alt={user.fullName}
            size={48}
          />

          <div>
            <h3
              className="font-semibold"
              style={{ color: COLORS.text }}
            >
              {user.fullName}
            </h3>

            <p
              className="text-sm"
              style={{ color: COLORS.muted }}
            >
              {user.provider}
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Email",
      render: (user) => (
        <span style={{ color: COLORS.text }}>
          {user.email}
        </span>
      ),
    },

    {
      header: "Role",
      render: (user) => (
        <span
          className="capitalize"
          style={{ color: COLORS.text }}
        >
          {user.role}
        </span>
      ),
    },

    {
      header: "Verified",
      render: (user) => (
        <StatusBadge
          status={user.emailVerified ? "published" : "draft"}
          size="sm"
        />
      ),
    },

    {
      header: "Actions",
      className: "text-right",
      render: (user) => (
        <ActionButtons
          viewUrl={`/users/${user._id}`}
          editUrl={`/users/${user._id}/edit`}
          deleteId={user._id}
          deleteType="user"
        />
      ),
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className="text-4xl font-bold"
            style={{ color: COLORS.text }}
          >
            Users
          </h1>

          <p
            className="mt-2"
            style={{ color: COLORS.muted }}
          >
            Manage platform users and permissions.
          </p>
        </div>

        <Link
          href="/users/create"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.background,
          }}
        >
          <Plus size={18} />
          Add User
        </Link>
      </div>

      <div
        className="mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3"
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        }}
      >
        <Search size={18} color={COLORS.muted} />

        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-transparent outline-none"
          style={{ color: COLORS.text }}
        />
      </div>

      <Card className="overflow-hidden p-0">
        <DataTable
          data={users}
          columns={columns}
          emptyMessage="No users found."
        />
      </Card>
    </main>
  );
}