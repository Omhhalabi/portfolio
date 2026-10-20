import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import {
  identity,
  certifications,
  education,
  skillGroups,
} from "@/content/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/**
 * Variables are suffixed `-src` so the `@theme` tokens in globals.css can
 * reference them without defining `--font-display` in terms of itself.
 * Weights are exactly those the type scale uses (§2.1) — no unused files.
 */
const display = Space_Grotesk({
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  preload: true,
});

const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${identity.name} — ${identity.role}`,
    template: `%s — ${identity.name}`,
  },
  description: identity.metaDescription,
  applicationName: `${identity.name} — Portfolio`,
  authors: [{ name: identity.name, url: identity.linkedin }],
  creator: identity.name,
  keywords: [
    "cyber security officer",
    "purple team",
    "detection engineering",
    "Wazuh",
    "threat hunting",
    "application security",
    "SOC analyst",
    "CVSS",
    "OSINT",
    "AI-assisted security",
    "Claude Code",
    "MCP",
    identity.name,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: identity.name,
    title: `${identity.name} — ${identity.role}`,
    description: identity.metaDescription,
    url: siteUrl,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.role}`,
    description: identity.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#05070A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * schema.org Person graph. Built from the same content module as the page,
 * so it cannot drift from what is rendered.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.role,
  description: identity.metaDescription,
  email: `mailto:${identity.email}`,
  url: siteUrl,
  sameAs: [identity.linkedin],
  worksFor: { "@type": "Organization", name: identity.company },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sidon District",
    addressRegion: "South Governorate",
    addressCountry: "LB",
  },
  alumniOf: education.map((e) => ({
    "@type": "EducationalOrganization",
    name: e.institution,
  })),
  hasCredential: certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    recognizedBy: { "@type": "Organization", name: c.issuer },
  })),
  knowsAbout: skillGroups.flatMap((g) => g.skills.map((s) => s.name)),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          // Serialised from a local literal; no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
