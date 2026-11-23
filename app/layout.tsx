import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { PROFILE } from "./data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "Backend and full-stack developer, co-founder of Cipher and Level 400 Computer Science student at KNUST. I build Node.js, Next.js and PostgreSQL systems that hold up in production.";

export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.site),
  title: {
    default: `${PROFILE.name} | ${PROFILE.role}`,
    template: `%s | ${PROFILE.name}`,
  },
  description,
  keywords: ["Nyarko Osumanu Adamu", "oanyarko7", "backend developer", "full-stack developer", "Ghana", "KNUST", "Next.js", "Node.js", "Computer Vision"],
  authors: [{ name: PROFILE.name, url: PROFILE.site }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  openGraph: {
    title: `${PROFILE.name} | ${PROFILE.role}`,
    description,
    url: PROFILE.site,
    siteName: PROFILE.name,
    type: "website",
    locale: "en_GB",
    // The image itself comes from app/opengraph-image.tsx (Next adds it automatically).
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} | ${PROFILE.role}`,
    description,
  },
  alternates: { canonical: "/" },
};

// Structured data so search engines can show a proper profile result.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  alternateName: "oanyarko7",
  jobTitle: PROFILE.role,
  url: PROFILE.site,
  image: `${PROFILE.site}/profile.jpg`,
  email: `mailto:${PROFILE.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
  worksFor: [
    { "@type": "Organization", name: "Decimal.Inc Ltd" },
    { "@type": "Organization", name: "Glinax" },
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Kwame Nkrumah University of Science and Technology" },
  sameAs: [PROFILE.github, PROFILE.linkedin],
  knowsAbout: ["Backend development", "Full-stack development", "Node.js", "Next.js", "PostgreSQL", "Cloud infrastructure", "Computer Vision", "Roboflow"],
};

export const viewport: Viewport = {
  themeColor: "#090b09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks JS as available so scroll-reveal styles only hide content when they can also show it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
