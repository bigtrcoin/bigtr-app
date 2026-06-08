import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bigtr App",
  description: "Bigtr Coin Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}