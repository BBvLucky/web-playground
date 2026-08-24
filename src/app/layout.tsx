import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptocrap",
  description: "Yet another useless dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen max-h-screen overflow-hidden flex flex-col bg-background text-foreground antialiased select-none">
        <Header />
        <div className="flex flex-1 flex-col md:flex-row min-h-0 w-full relative">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6 min-h-0 bg-neutral-50 dark:bg-neutral-950/20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
