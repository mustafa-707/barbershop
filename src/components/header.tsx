"use client"
import * as React from "react"
import { Link } from "~/i18n/routing"
import { Scissors, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { ModeToggle } from "./mode-toggle"
import { LanguageSwitcher } from "./language-switcher"
import { UserNav } from "./user-nav"
import { CartSheet } from "./cart-sheet"

export function Header() {
  const t = useTranslations('Nav')
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 w-full glass-header backdrop-blur-md bg-background/80 border-b border-white/5 transition-all duration-500">
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
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors">{t('home')}</Link>
            <Link href="/#products" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors">{t('shop')}</Link>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors">{t('contact')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartSheet />
          <UserNav />
          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-foreground focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-16 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden z-40 overflow-hidden"
          >
            <nav className="flex flex-col items-center gap-10">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors p-4">{t('home')}</Link>
              <Link href="/#products" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors p-4">{t('shop')}</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors p-4">{t('contact')}</Link>
            </nav>
            <div className="flex items-center gap-8 mt-4">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
