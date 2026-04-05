"use client";
import * as React from "react";
import { Link } from "~/i18n/routing";
import { Scissors, Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer({ openingHoursEn, openingHoursAr, locale }: { openingHoursEn?: string | null, openingHoursAr?: string | null, locale?: string }) {
  const tNav = useTranslations("Nav");
  const tFoot = useTranslations("Footer");
  const hoursData = locale === 'ar' ? openingHoursAr : openingHoursEn;
  const finalHours = hoursData ?? (locale === 'ar' ? "الإثنين-السبت: ١٠ص - ٩م | الأحد: مغلق" : "Mon-Sat: 10AM - 9PM | Sun: Closed");
  
  return (
    <footer className="border-t border-border bg-background pt-24 pb-12 overflow-hidden relative">
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-20 mb-24">
          {/* Brand */}
          <div className="space-y-10 max-w-xs">
            <Link href="/" className="flex items-center gap-4 group inline-flex">
              <div className="w-12 h-12 bg-primary rounded-none flex items-center justify-center text-primary-foreground">
                <Scissors className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground">
                BarberShop
              </span>
            </Link>
            <p className="text-sm text-foreground/40 font-medium leading-relaxed tracking-wide uppercase">
              {tFoot("description")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 flex-1 max-w-3xl">
            {/* Quick Links */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">{tFoot("explore")}</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">{tNav("home")}</Link>
                </li>
                <li>
                  <Link href="/#products" className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">{tNav("shop")}</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">{tFoot("contact")}</Link>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">{tFoot("connect")}</h4>
              <ul className="space-y-4">
                <li className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 break-all">
                  +962 7 9876 5432
                </li>
                <li className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 break-all">
                  info@barberamman.com
                </li>
                <li className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 break-all">
                  Amman, Jordan
                </li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">{tFoot("visit")}</h4>
              <ul className="space-y-4">
                {finalHours.split('|').map((line, idx) => (
                   <li key={idx} className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                     <span className="text-foreground/20">{line.split(':')[0]}</span>
                     <span className={line.toLowerCase().includes('closed') || line.toLowerCase().includes('مغلق') ? 'text-primary' : ''}>
                       {line.split(':').slice(1).join(':')}
                     </span>
                   </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/20">
            &copy; {new Date().getFullYear()} BARBERSHOP. {tFoot("rights")}
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/20 hover:text-primary transition-colors">{tFoot("privacy")}</Link>
            <Link href="/terms" className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/20 hover:text-primary transition-colors">{tFoot("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
