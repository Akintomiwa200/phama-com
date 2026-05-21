import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { AppProvider } from "@/lib/store";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pharmacy AI Safety System",
  description: "AI-powered medication dispensing safety checks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
