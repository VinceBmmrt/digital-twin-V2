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
  title: "Vincent Bommert — AI Digital Twin",
  description: "Digital Twin IA de Vincent Bommert — LLM, RAG, Multi-agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" style={{ minHeight: '100%', overflowX: 'hidden' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          minHeight: '100%',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
          background: '#060d18',
        }}
      >
        {children}
      </body>
    </html>
  );
}