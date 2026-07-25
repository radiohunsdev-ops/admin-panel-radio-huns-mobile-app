"use client";
import { ChevronDown, LogOut,  UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";

export default function Header() {
  const router = useRouter();
const handleLogout = async () => {
  try {
    const response = await fetch(
      "/api/auth/logout",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    router.replace("/login");
    router.refresh();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur-xl"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
      }}
    >
      <div />

      <div className="flex items-center gap-2">
        <div className="group relative">
          <button
            className="flex items-center gap-3 rounded-2xl border px-3 py-2"
            style={{
              backgroundColor: COLORS.softCard,
              borderColor: COLORS.border,
            }}
          >
            <UserCircle2
              className="h-9 w-9"
              style={{
                color: COLORS.primary,
              }}
            />

            <div className="hidden text-left md:block">
              <p
                className="text-sm font-medium"
                style={{
                  color: COLORS.text,
                }}
              >
                Admin
              </p>

              <p
                className="text-xs"
                style={{
                  color: COLORS.muted,
                }}
              >
                Super Administrator
              </p>
            </div>

            <ChevronDown
              className="h-4 w-4 transition-transform group-hover:rotate-180"
              style={{
                color: COLORS.muted,
              }}
            />
          </button>

          {/* Dropdown */}
          <div
            className="invisible absolute right-0 mt-3 w-52 translate-y-2 overflow-hidden rounded-2xl border opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
            style={{
              backgroundColor: COLORS.card,
              borderColor: COLORS.border,
            }}
          >
            <div
              className="border-b px-4 py-3"
              style={{
                borderColor: COLORS.border,
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{
                  color: COLORS.text,
                }}
              >
                Admin
              </p>

              <p
                className="text-xs"
                style={{
                  color: COLORS.muted,
                }}
              >
                admin@gmail.com
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all hover:bg-red-500/10"
                style={{
                  color: "#ef4444",
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
