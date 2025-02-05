import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import SupabaseProvider from "@/lib/supabase/provider";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Financial Analytics Platform",
  description: "Advanced credit and fixed income analytics platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <SupabaseProvider>
          <Providers>
            {children}
          </Providers>
        </SupabaseProvider>
      </body>
    </html>
  );
}
