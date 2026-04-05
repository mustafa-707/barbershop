"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "~/i18n/routing"
import { Button } from "~/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const t = useTranslations("Nav")

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en"
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <button 
      onClick={toggleLocale} 
      className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors px-2"
    >
      {locale === "en" ? t("langAr") : t("langEn")}
    </button>
  )
}
