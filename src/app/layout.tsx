import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "RDW Roofing Dashboard",
  description: "Sales and Call Tracking Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <Toaster />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}