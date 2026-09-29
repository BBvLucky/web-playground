import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "next-i18next/client";
import { dir } from "i18next";
import { getResources, getT, initServerI18next } from "next-i18next/server";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/providers/useGetUserProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import i18nConfig from "@/i18n.config";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

initServerI18next(i18nConfig);

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("common");

  return {
    title: t("media.name"),
    description: t("media.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { i18n, lng } = await getT();
  const resources = getResources(i18n);

  return (
    <html
      lang={lng}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      dir={dir(lng)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
                try {
                  var t = localStorage.getItem("web-playground-theme");
                  var dark = t === "dark" ||
                    (t !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
                  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
                } catch (e) {}
              })();`,
          }}
        />
      </head>
      <body className="min-h-screen max-h-screen overflow-hidden flex flex-col bg-background text-foreground antialiased select-none">
        <I18nProvider
          language={lng}
          resources={resources}
          supportedLngs={i18nConfig.supportedLngs}
        >
          <AuthProvider>
            <ThemeProvider>
              <Header />
              <div className="flex flex-1 flex-col md:flex-row min-h-0 w-full relative">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6 min-h-0 bg-neutral-50 dark:bg-neutral-950/20">
                  {children}
                </main>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
