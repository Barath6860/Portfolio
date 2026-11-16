import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/data/profile";
import { themeInitScript } from "@/lib/theme-script";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.name} — Software Developer Portfolio`;
const description =
  "Barath Raj S P is a Computer Science Engineering student building trustworthy, practical software — including TrustScan, a bias-aware abstention framework for autism neuroimaging research, and DocTranslate Enterprise, a privacy-aware document translation app.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: profile.github.url }],
  creator: profile.name,
  keywords: ["Barath Raj S P", "software developer", "portfolio", "computer science", "TrustScan", "DocTranslate", "neuroimaging", "fairness", "Python"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${profile.name} Portfolio`,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000302" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${geistSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
