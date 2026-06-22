import type { Metadata } from "next";
import "../(dashboard)/globals.css";

import { COLORS } from "@/constants/colors";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen"
        style={{
          backgroundColor: COLORS.background,
        }}
      >
        <main className="flex min-h-screen items-center justify-center p-5">
          {children}
        </main>
      </body>
    </html>
  );
}