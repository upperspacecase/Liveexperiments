import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Experiments",
  description:
    "A living portfolio that auto-populates from Vercel projects. Not a highlight reel — a workshop window.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
