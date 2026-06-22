"use client";

import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Radio,
  X,
} from "lucide-react";

import { COLORS } from "@/constants/colors";

import SidebarItem from "./SidebarItem";
import { menuItems } from "@/constants";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleMobileSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileSidebar}
        className="fixed top-5 left-5 z-50 lg:hidden p-3 rounded-2xl transition-all duration-300"
        style={{
          backgroundColor: COLORS.card,
        }}
      >
        <Menu size={20} color={COLORS.text} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50
          h-screen border-r
          transition-all duration-300
          flex flex-col
          ${collapsed ? "w-24" : "w-72"}
          ${mobileOpen ? "left-0" : "-left-full lg:left-0"}
        `}
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: COLORS.primary,
                }}
              >
                <Radio size={24} color={COLORS.background} />
              </div>

              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{
                    color: COLORS.text,
                  }}
                >
                  RadioHuns
                </h1>

                <p
                  className="text-sm"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  Admin Panel
                </p>
              </div>
            </div>
          )}

          <button
            onClick={isMobile ? handleMobileSidebar : handleToggleSidebar}
            className="p-2 rounded-xl transition-all duration-300 shrink-0"
            style={{
              backgroundColor: COLORS.softCard,
            }}
          >
            {isMobile ? (
              <X size={18} color={COLORS.text} />
            ) : collapsed ? (
              <ChevronRight size={18} color={COLORS.text} />
            ) : (
              <ChevronLeft size={18} color={COLORS.text} />
            )}
          </button>
        </div>

        {/* Scrollable Menu */}
        <div
          className="
            flex-1 overflow-y-auto px-5 pb-5
            scrollbar-thin
            scrollbar-thumb-rounded-full
            scrollbar-track-transparent
          "
          style={
            {
              scrollbarColor: `${COLORS.primary} ${COLORS.card}`,
            } as React.CSSProperties
          }
        >
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.title}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}