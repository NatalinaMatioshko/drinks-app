import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const serif = Source_Serif_4({
  variable: "--font-source",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Журнал напоїв",
  description: "Особистий облік спробуваних напоїв: смак, оцінка і ціна.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
