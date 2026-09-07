import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sourceSansPro = localFont({
  variable: "--font-source-sans",
  src: [
    {
      path: "./fonts/source-sans-pro-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-pro-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/source-sans-pro-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-pro-semibold-italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/source-sans-pro-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-pro-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

const signifier = localFont({
  variable: "--font-signifier",
  src: [
    {
      path: "./fonts/test-signifier-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/test-signifier-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/test-signifier-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/test-signifier-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/test-signifier-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/test-signifier-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Isabella Linde",
  description: "Isabella's portfolio site.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSansPro.variable} ${signifier.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
