import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAVORA | A Modern Dining Experience",
  description:
    "Discover SAVORA, where seasonal ingredients, thoughtful cooking, and unforgettable dining experiences come together.",
  applicationName: "SAVORA",
  keywords: [
    "restaurant",
    "fine dining",
    "Italian food",
    "restaurant experience",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}