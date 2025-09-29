import "./globals.css";

import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NASA Explorer - Space Data Portal",
    template: "%s | NASA Explorer",
  },
  description:
    "Explore the universe with NASA's official data - Mars rover photos, astronomy pictures, space weather, and more.",
  keywords: [
    "NASA",
    "space",
    "astronomy",
    "Mars rover",
    "APOD",
    "space weather",
    "asteroids",
    "space exploration",
  ],
  authors: [{ name: "NASA Explorer" }],
  creator: "NASA Explorer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nasa-explorer.com",
    title: "NASA Explorer - Space Data Portal",
    description:
      "Explore the universe with NASA's official data - Mars rover photos, astronomy pictures, space weather, and more.",
    siteName: "NASA Explorer",
  },
  twitter: {
    card: "summary_large_image",
    title: "NASA Explorer - Space Data Portal",
    description:
      "Explore the universe with NASA's official data - Mars rover photos, astronomy pictures, space weather, and more.",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
