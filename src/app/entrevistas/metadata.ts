import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrevistas | Taylor Swift",
  description: "Colección completa de entrevistas a Taylor Swift a lo largo de su historia. Desde los inicios hasta la actualidad, accede a conversaciones exclusivas y declaraciones históricas.",
  keywords: [
    "Taylor Swift entrevistas",
    "Taylor Swift interviews",
    "pop interviews",
    "entrevistas históricas",
    "declaraciones Taylor Swift",
  ],
  openGraph: {
    title: "Entrevistas | Taylor Swift",
    description: "Colección completa de entrevistas a Taylor Swift a lo largo de su historia.",
    url: "/entrevistas",
    siteName: "Taylor Swift Fan Site",
    type: "website",
    images: [
      {
        url: "/images/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Entrevistas de Taylor Swift - Colección completa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Entrevistas | Taylor Swift",
    description: "Colección completa de entrevistas a Taylor Swift a lo largo de su historia.",
    images: ["/images/placeholder.jpg"],
    creator: "@TaylorSwiftFanSite",
  },
  alternates: {
    canonical: "/entrevistas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
