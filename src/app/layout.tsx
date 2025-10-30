import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Shorts Automation Studio",
  description:
    "Generate YouTube Shorts ideas, scripts, shot lists, and publishing schedules in one place.",
  keywords: [
    "YouTube Shorts automation",
    "short form content planner",
    "viral video workflow",
    "creator automation",
  ],
  openGraph: {
    title: "Shorts Automation Studio",
    description:
      "Launch a ready-to-film YouTube Shorts drop: ideas, scripts, shots, and publishing timeline.",
    url: "https://agentic-6c6f9b50.vercel.app",
    siteName: "Shorts Automation Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
