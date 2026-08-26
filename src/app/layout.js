import { Caveat, Geist, Instrument_Serif } from "next/font/google";
import { Aurora, Grain } from "@/components/atmosphere";
import Nav from "@/components/nav";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const site =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Things I Never Said",
    template: "%s — Things I Never Said",
  },
  description:
    "An anonymous wall for the words people never had the courage to say. Write one. Drag through thousands.",
  openGraph: {
    title: "Things I Never Said",
    description:
      "An anonymous wall for the words people never had the courage to say.",
    type: "website",
    siteName: "Things I Never Said",
  },
  twitter: {
    card: "summary_large_image",
    title: "Things I Never Said",
    description:
      "An anonymous wall for the words people never had the courage to say.",
  },
};

export const viewport = {
  themeColor: "#f3efe7",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${instrument.variable} ${caveat.variable}`}>
      <body>
        <Aurora />
        <Nav />
        {children}
        <Grain />
      </body>
    </html>
  );
}
