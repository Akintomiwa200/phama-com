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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 11-8-8-8.6 8.6a2.12 2.12 0 0 0 0 3l8.6 8.6a2.12 2.12 0 0 0 3 0L21.4 14a2.12 2.12 0 0 0 0-3Z" />
                  <path d="M9 13l6-6" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm leading-tight">Pharmacy AI</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Safety System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-600">System Online</span>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6">{children}</main>

        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-gray-500">
            <span>Pharmacy AI Safety System v0.1.0</span>
            <span>Demo Mode</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
