"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { COLORS } from "@/constants/colors";
import { SidebarMenuItem } from "@/types/Siderbar";

interface SidebarItemProps {
  item: SidebarMenuItem;
  collapsed: boolean;
}

export default function SidebarItem({
  item,
  collapsed,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = pathname === item.href;

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300"
      style={{
        backgroundColor: isActive
          ? COLORS.primary
          : "transparent",
        color: isActive
          ? COLORS.background
          : COLORS.text,
      }}
    >
      <Icon size={20} />

      {!collapsed && (
        <span className="font-medium">
          {item.title}
        </span>
      )}
    </Link>
  );
}