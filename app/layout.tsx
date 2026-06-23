import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LocaleWrapper } from "@/components/locale-wrapper";
import { validateEnv } from "@/lib/env";
import "./globals.css";

validateEnv();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Karen Manicures – Beautiful Nails for Every Occasion",
  description:
    "Professional manicure and pedicure services in Calauag, Quezon. Book online or via Messenger.",
  icons: {
    icon: "/favicon.svg",
  },
  authors: [{ name: "Jaostudio", url: "https://jaostudio.com" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://karenmanicures.com",
  },
  openGraph: {
    title: "Karen Manicures",
    description: "Professional nail care in Calauag, Quezon",
    type: "website",
    locale: "en_PH",
    siteName: "Karen Manicures",
    url: "https://karenmanicures.com",
    images: [
      {
        url: "https://karenmanicures.com/api/og",
        width: 1200,
        height: 630,
        alt: "Karen Manicures — Beautiful nails made with care",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <LocaleWrapper>
          {children}
        </LocaleWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
