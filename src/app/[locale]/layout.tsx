import "~/styles/globals.css";
import { db } from "~/server/db";

import { type Metadata, type Viewport } from "next";
import { Inter, Cairo, Outfit, Playfair_Display, Roboto, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { ThemeProvider } from "~/components/theme-provider";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "~/components/auth-provider";

import { TRPCReactProvider } from "~/trpc/react";

// Dynamic metadata based on DB settings
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await db.query.settings.findFirst();
  
  const siteName = locale === 'ar'
    ? (settings?.siteNameAr ?? "صالون الحلاقة")
    : (settings?.siteNameEn ?? "BarberShop");
  
  const description = locale === 'ar'
    ? (settings?.descriptionAr ?? "تجربة متميزة في العناية الشخصية")
    : (settings?.descriptionEn ?? "Experience excellence in grooming. Book your appointment now.");

  const faviconUrl = settings?.faviconUrl || "/favicon.ico";

  return {
    title: `${siteName} | Premium Grooming`,
    description,
    manifest: "/manifest.webmanifest",
    icons: [{ rel: "icon", url: faviconUrl }],
    appleWebApp: {
      title: siteName,
      statusBarStyle: "black-translucent",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });
const tajawal = Tajawal({ weight: ["400", "700", "900"], subsets: ["arabic"], variable: "--font-tajawal" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const roboto = Roboto({ weight: ["400", "700", "900"], subsets: ["latin"], variable: "--font-roboto" });

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const messages = await getMessages();
  const settings = await db.query.settings.findFirst();

  const fontMap: Record<string, string> = {
    'Inter': 'var(--font-inter)',
    'Outfit': 'var(--font-outfit)',
    'Playfair Display': 'var(--font-playfair)',
    'Roboto': 'var(--font-roboto)',
  };

  const selectedFont = settings?.fontFamily ? fontMap[settings.fontFamily] ?? 'var(--font-inter)' : 'var(--font-inter)';

  const themeVars = {
    '--primary': settings?.primaryColor ?? '#C5A059',
    '--secondary': settings?.secondaryColor ?? '#1e293b',
    '--background': settings?.backgroundColor ?? '#020617',
    '--foreground': settings?.textColor ?? '#f8fafc',
    '--radius': settings?.radius ?? '2.5rem',
    '--font-family': locale === 'ar' ? 'var(--font-tajawal)' : selectedFont,
  } as React.CSSProperties;

  return (
    <html 
      suppressHydrationWarning 
      lang={locale} 
      dir={locale === 'ar' ? 'rtl' : 'ltr'} 
      className={`${inter.variable} ${cairo.variable} ${tajawal.variable} ${outfit.variable} ${playfair.variable} ${roboto.variable}`}
    >
      <body className="antialiased font-[family-name:var(--font-family)]" style={themeVars}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <AuthProvider>
                <div className="flex min-h-screen flex-col bg-slate-950 text-foreground overflow-x-hidden">
                  <Header />
                  <main className="flex-1 pb-16">
                    {children}
                  </main>
                  <Footer openingHoursEn={settings?.openingHoursEn} openingHoursAr={settings?.openingHoursAr} locale={locale} />
                  <Toaster position="top-center" richColors />
                </div>
              </AuthProvider>
            </TRPCReactProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
