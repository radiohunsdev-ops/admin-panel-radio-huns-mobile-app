 import Link from "next/link";
import { Eye, Pencil, Plus, Search, User } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import DeleteButton from "@/common/DeleteButton";
import { IconButton } from "@/common/IconButton";
import { StatusBadge } from "@/common/StatusBadge";
import { getUsers, User as UserType } from "@/lib/userApi";
export default async function UsersPage() {
  const users: UserType[] = await getUsers();
  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {" "}
      {/* HEADER */}{" "}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-4xl font-bold" style={{ color: COLORS.text }}>
            {" "}
            Users{" "}
          </h1>{" "}
          <p className="mt-2" style={{ color: COLORS.muted }}>
            {" "}
            Manage platform users and permissions.{" "}
          </p>{" "}
        </div>{" "}
        <Link
          href="/users/create"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{ backgroundColor: COLORS.primary, color: COLORS.background }}
        >
          {" "}
          <Plus size={18} /> Add User{" "}
        </Link>{" "}
      </div>{" "}
      {/* SEARCH */}{" "}
      <div
        className="mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3"
        style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
      >
        {" "}
        <Search size={18} color={COLORS.muted} />{" "}
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-transparent outline-none"
          style={{ color: COLORS.text }}
        />{" "}
      </div>{" "}
      {/* TABLE CARD */}{" "}
      <Card className="overflow-hidden p-0">
        {" "}
        {/* DESKTOP TABLE */}{" "}
        <div className="hidden overflow-x-auto lg:block">
          {" "}
          <table className="w-full">
            {" "}
            <thead style={{ backgroundColor: COLORS.softCard }}>
              {" "}
              <tr>
                {" "}
                {["User", "Email", "Role", "Verified", "Actions"].map((col) => (
                  <th
                    key={col}
                    className={`p-5 ${col === "Actions" ? "text-right" : "text-left"}`}
                    style={{ color: COLORS.muted }}
                  >
                    {" "}
                    {col}{" "}
                  </th>
                ))}{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t"
                    style={{ borderColor: COLORS.border }}
                  >
                    {" "}
                    {/* USER */}{" "}
                    <td className="p-5">
                      {" "}
                      <div className="flex items-center gap-4">
                        {" "}
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: COLORS.softCard }}
                        >
                          {" "}
                          <User size={20} color={COLORS.primary} />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <h3
                            className="font-semibold"
                            style={{ color: COLORS.text }}
                          >
                            {" "}
                            {user.fullName}{" "}
                          </h3>{" "}
                          <p
                            className="text-sm"
                            style={{ color: COLORS.muted }}
                          >
                            {" "}
                            {user.provider}{" "}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                    </td>{" "}
                    {/* EMAIL */}{" "}
                    <td className="p-5" style={{ color: COLORS.text }}>
                      {" "}
                      {user.email}{" "}
                    </td>{" "}
                    {/* ROLE */}{" "}
                    <td
                      className="p-5 capitalize"
                      style={{ color: COLORS.text }}
                    >
                      {" "}
                      {user.role}{" "}
                    </td>{" "}
                    {/* VERIFIED */}{" "}
                    <td className="p-5">
                      {" "}
                      <StatusBadge
                        status={user.emailVerified ? "published" : "draft"}
                        size="sm"
                      />{" "}
                    </td>{" "}
                    {/* ACTIONS */}{" "}
                    <td className="p-5">
                      {" "}
                      <div className="flex items-center justify-end gap-3">
                        {" "}
                        <IconButton
                          href={`/users/${user._id}`}
                          icon={<Eye size={18} color={COLORS.text} />}
                        />{" "}
                        <IconButton
                          href={`/users/${user._id}/edit`}
                          icon={<Pencil size={18} color={COLORS.primary} />}
                        />{" "}
                        <DeleteButton
                          id={user._id}
                          type="user"
                          title="Delete User"
                          description="This action cannot be undone."
                        />{" "}
                      </div>{" "}
                    </td>{" "}
                  </tr>
                ))
              ) : (
                <tr>
                  {" "}
                  <td
                    colSpan={5}
                    className="p-10 text-center"
                    style={{ color: COLORS.muted }}
                  >
                    {" "}
                    No users found.{" "}
                  </td>{" "}
                </tr>
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
        {/* MOBILE VIEW */}{" "}
        <div className="divide-y lg:hidden">
          {" "}
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="p-5">
                {" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: COLORS.softCard }}
                  >
                    {" "}
                    <User size={22} color={COLORS.primary} />{" "}
                  </div>{" "}
                  <div className="flex-1">
                    {" "}
                    <h3
                      className="font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      {" "}
                      {user.fullName}{" "}
                    </h3>{" "}
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      {" "}
                      {user.email}{" "}
                    </p>{" "}
                    <p
                      className="text-sm capitalize"
                      style={{ color: COLORS.muted }}
                    >
                      {" "}
                      {user.role}{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="mt-4">
                  {" "}
                  <StatusBadge
                    status={user.emailVerified ? "published" : "draft"}
                    size="sm"
                  />{" "}
                </div>{" "}
                <div className="mt-4 flex justify-end gap-3">
                  {" "}
                  <IconButton
                    href={`/users/${user._id}`}
                    icon={<Eye size={18} color={COLORS.text} />}
                  />{" "}
                  <IconButton
                    href={`/users/${user._id}/edit`}
                    icon={<Pencil size={18} color={COLORS.primary} />}
                  />{" "}
                  <DeleteButton
                    id={user._id}
                    type="user"
                    title="Delete User"
                    description="This action cannot be undone."
                  />{" "}
                </div>{" "}
              </div>
            ))
          ) : (
            <div className="p-10 text-center" style={{ color: COLORS.muted }}>
              {" "}
              No users found.{" "}
            </div>
          )}{" "}
        </div>{" "}
      </Card>{" "}
    </main>
  );
}
