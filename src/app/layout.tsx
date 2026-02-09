import type { Metadata } from "next";
import { Cormorant_Garamond, Sora } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display"
});

const body = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Atomic Cafe | Specialty Coffee",
  description: "Atomic Cafe serves modern specialty coffee with a premium, slow-bar experience.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Atomic Cafe | Specialty Coffee",
    description: "Modern specialty coffee with a premium, slow-bar experience.",
    images: ["/og.svg"]
  },
  icons: [{ rel: "icon", url: "/icon.svg" }]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${body.variable} bg-background text-textPrimary`}>
        {children}
      </body>
    </html>
  );
}
