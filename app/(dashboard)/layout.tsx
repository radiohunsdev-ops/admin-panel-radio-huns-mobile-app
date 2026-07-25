import "./globals.css";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { COLORS } from "@/constants/colors";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor:
            COLORS.background,
        }}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-5 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}