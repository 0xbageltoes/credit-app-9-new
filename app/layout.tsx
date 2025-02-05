import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SupabaseProvider from "@/lib/supabase/provider";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <SupabaseProvider>
          <Providers>
            {children}
          </Providers>
        </SupabaseProvider>
      </body>
    </html>
  );
}
