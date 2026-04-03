import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "~/components/theme-provider";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "~/components/auth-provider";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "BarberShop Amman | Premium Grooming",
  description: "Experience excellence in grooming at BarberShop Amman. Book your appointment now.",
  manifest: "/manifest.webmanifest",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  appleWebApp: {
    title: "BarberShop",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${inter.variable} ${cairo.variable}`}>
      <body className="antialiased">
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
                  <Footer />
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
