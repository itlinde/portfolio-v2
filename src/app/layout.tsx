import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const sourceSans3 = localFont({
  variable: "--font-source-sans",
  src: [
    {
      path: "../fonts/source-sans-3-variable.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../fonts/source-sans-3-variable-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
});

const signifier = localFont({
  variable: "--font-signifier",
  src: [
    {
      path: "../fonts/test-signifier-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/test-signifier-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/test-signifier-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/test-signifier-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/test-signifier-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/test-signifier-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Isabella Linde",
  description: "Isabella's portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans3.variable} ${signifier.variable} h-full antialiased`}
    >
      <Analytics/>
      <body className="min-h-full flex flex-col text-balance">{children}</body>
    </html>
  );
}
