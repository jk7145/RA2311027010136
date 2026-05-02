import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Placements, results, and campus events in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
