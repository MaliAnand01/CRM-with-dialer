import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinTel | Contact Center CRM & Dialer",
  description:
    "Enterprise telecalling CRM and dialer platform for banking and NBFC contact centers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${dmSans.variable}`} suppressHydrationWarning>
      <body className="h-full font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
