import { IBM_Plex_Mono, Noto_Sans } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { PageContent } from "@/components/page-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const themeScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

const notoSans = Noto_Sans({
  variable: "--font-source-sans",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://cpgram.usersynax.dev"),
  title: "CPGRAMS — File or track a government complaint",
  verification: {
    google: "mtSQQTLUoP5DvYa7RCE6CnrEoUYfmWX0FdkkYzDO8Po",
  },
  description:
    "File a complaint with a government department, or track a complaint you have already lodged. This service is free.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "CPGRAMS (Hackathon Prototype)",
    title: "CPGRAMS — File or track a government complaint",
    description:
      "File a complaint with a government department, or track a complaint you have already lodged. This service is free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CPGRAMS Hackathon Prototype",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "",
    title: "CPGRAMS — File or track a government complaint",
    description:
      "File a complaint with a government department, or track a complaint you have already lodged. This service is free.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const theme = (await cookies()).get("theme")?.value;
  const isDark = theme === "dark";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${notoSans.variable} ${plexMono.variable} h-full${isDark ? " dark" : ""}`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#ffdd00] focus:px-4 focus:py-3 focus:text-[19px] focus:font-bold focus:text-[#0b0c0c] focus:outline-none"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <PageContent>{children}</PageContent>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
