import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: "Essence Tracker",
  description: "Every action is a transaction. Calculate your gains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "font-body antialiased",
          fontBody.variable,
          fontCode.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
