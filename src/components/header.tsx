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
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-gold"
            >
              <Scissors className="w-6 h-6" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary/80 transition-all duration-300"
            >
              BarberShop
            </motion.span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors">{t('home')}</Link>
            <Link href="/#products" className="text-sm font-bold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors">{t('shop')}</Link>
            <Link href="/contact" className="text-sm font-bold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors">{t('contact')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartSheet />
          <UserNav />
          <div className="h-8 w-[1px] bg-foreground/10 mx-2 hidden sm:block" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
