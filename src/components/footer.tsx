"use client";
import * as React from "react";
import { Link } from "~/i18n/routing";
import { Scissors, Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer({ openingHoursEn, openingHoursAr, locale }: { openingHoursEn?: string | null, openingHoursAr?: string | null, locale?: string }) {
  const t = useTranslations("Nav");
  const hoursData = locale === 'ar' ? openingHoursAr : openingHoursEn;
  const finalHours = hoursData ?? (locale === 'ar' ? "الإثنين-السبت: ١٠ص - ٩م | الأحد: مغلق" : "Mon-Sat: 10AM - 9PM | Sun: Closed");
  
  return (
    <footer className="border-t border-border/10 bg-black/5 dark:bg-black/20 pt-16 pb-8 backdrop-blur-3xl overflow-hidden relative">
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-gold">
                <Scissors className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary/80">
                BarberShop
              </span>
            </Link>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
              Providing premium grooming services and high-quality styling products for the modern gentleman. Experience the best in town.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t("home")}</Link>
              </li>
              <li>
                <Link href="/#products" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t("shop")}</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground font-medium">
                <Phone className="w-5 h-5 text-primary" />
                <span>+962 7 9876 5432</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground font-medium">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@barberamman.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground font-medium">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Amman, Jordan</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Opening Hours</h4>
            <ul className="space-y-4">
              {finalHours.split('|').map((line, idx) => (
                 <li key={idx} className="flex justify-between items-center text-muted-foreground font-medium border-b border-border/10 pb-2">
                   <span>{line.split(':')[0]}</span>
                   <span className={line.toLowerCase().includes('closed') || line.toLowerCase().includes('مغلق') ? 'text-primary font-bold' : ''}>
                     {line.split(':').slice(1).join(':')}
                   </span>
                 </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} BarberShop. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
