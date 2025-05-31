import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/AuthProvider";
import TopNav from "@/app/components/Nav/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Melodot",
  description: "Spotify playback and statistics.",
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
          <AuthProvider>
              <div className="flex flex-col min-h-screen">
                  <TopNav />
                  <div className="bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
                      {children}
                  </div>
              </div>
          </AuthProvider>
      </body>
    </html>
  );
}
