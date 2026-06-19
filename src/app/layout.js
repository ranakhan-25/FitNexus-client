import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import LayoutWrapper from "@/components/service/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "FitNexus | Fitness & Gym Management Platform",
  description:
    "FitNexus is a modern fitness and gym management platform where users can discover classes, book sessions, connect with trainers, and achieve their fitness goals.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body
        suppressHydrationWarning
        className="font-sans min-h-screen antialiased"
      >
        <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
