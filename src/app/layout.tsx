import { AppProvider } from "@/context/app-context";
import { AuthProvider } from "@/context/auth-context";
import { cn } from "@/utils/cn";
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

import { APP_NAME } from "@/constants";
import "../styles/globals.css";
import "../styles/markdown.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Build consistency. Track progress. Achieve mastery. A beautiful daily practice tracker to manage your learning habits, set goals, and celebrate achievements.",
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: "website",
    title: APP_NAME,
    description:
      "Build consistency. Track progress. Achieve mastery. A beautiful daily practice tracker to manage your learning habits and celebrate achievements.",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary",
    title: APP_NAME,
    description:
      "Build consistency. Track progress. Achieve mastery. A beautiful daily practice tracker to manage your learning habits and celebrate achievements.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          outfit.variable,
          "font-sans text-slate-800 antialiased selection:bg-brand-200 selection:text-brand-900 pb-6 overflow-x-hidden",
        )}
      >
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
