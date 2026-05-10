import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karada Log",
  description: "体重・食事・運動を記録するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
