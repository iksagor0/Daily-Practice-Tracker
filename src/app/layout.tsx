import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { AppProvider } from "@/context/app-context";
import { cn } from "@/utils/cn";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Practice Tracker",
  description: "Build consistency. Track progress. Achieve mastery. A beautiful daily practice tracker to manage your learning habits, set goals, and celebrate achievements.",
  authors: [{ name: "Daily Practice Tracker" }],
  openGraph: {
    type: "website",
    title: "Daily Practice Tracker",
    description: "Build consistency. Track progress. Achieve mastery. A beautiful daily practice tracker to manage your learning habits and celebrate achievements.",
    siteName: "Daily Practice Tracker",
  },
  twitter: {
    card: "summary",
    title: "Daily Practice Tracker",
    description: "Build consistency. Track progress. Achieve mastery. A beautiful daily practice tracker to manage your learning habits and celebrate achievements.",
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
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          outfit.variable,
          "font-sans text-slate-800 antialiased selection:bg-brand-200 selection:text-brand-900 pb-20 overflow-x-hidden"
        )}
      >
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
