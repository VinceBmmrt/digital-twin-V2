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
  metadataBase: new URL("https://d2s1zfamsgsifg.cloudfront.net"),
  title: "Vincent Bommert — AI Digital Twin",
  description:
    "Ingénieur IA & développeur fullstack. Discutez en direct avec mon jumeau numérique : agents IA, RAG, robotique.",
  openGraph: {
    title: "Vincent Bommert — AI Digital Twin",
    description:
      "Ingénieur IA & développeur fullstack. Discutez en direct avec mon jumeau numérique : agents IA, RAG, robotique.",
    url: "https://d2s1zfamsgsifg.cloudfront.net",
    siteName: "Vincent Bommert — Digital Twin",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vincent Bommert — AI Digital Twin",
    description:
      "Ingénieur IA & développeur fullstack. Discutez en direct avec mon jumeau numérique.",
  },
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