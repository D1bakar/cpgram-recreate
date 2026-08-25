import { IBM_Plex_Mono, Noto_Sans } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';localStorage.setItem('theme',t);}document.cookie='theme='+t+';path=/;max-age=31536000;SameSite=Lax';if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

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
  title: "CPGRAMS — File or track a government complaint",
  description:
    "File a complaint with a government department, or track a complaint you have already lodged. This service is free.",
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
      className={`${notoSans.variable} ${notoSans.className} ${plexMono.variable} h-full antialiased${isDark ? " dark" : ""}`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
