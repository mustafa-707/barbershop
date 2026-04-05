"use client"
import * as React from "react"
import { Link } from "~/i18n/routing"
import { Scissors } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { ModeToggle } from "./mode-toggle"
import { LanguageSwitcher } from "./language-switcher"
import { UserNav } from "./user-nav"
import { CartSheet } from "./cart-sheet"

export function Header() {
  const t = useTranslations('Nav')

  return (
    <header className="sticky top-0 z-50 w-full glass-header transition-all duration-500">
      <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.02 }}
              className="w-12 h-12 bg-primary rounded-none flex items-center justify-center text-primary-foreground"
            >
              <Scissors className="w-6 h-6" />
            </motion.div>
            <span className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground">
              BarberShop
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors">{t('home')}</Link>
            <Link href="/#products" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors">{t('shop')}</Link>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors">{t('contact')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartSheet />
          <UserNav />
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
