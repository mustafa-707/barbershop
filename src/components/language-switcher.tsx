"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "~/i18n/routing"
import { Button } from "~/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en"
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleLocale} 
      className="relative bg-black/5 dark:bg-white/5 border-transparent hover:border-border"
    >
      <Globe className="h-5 w-5 text-primary" />
      <span className="sr-only">Toggle Language</span>
      <span className="uppercase text-xs font-black tracking-widest text-white/70">{locale}</span>
    </Button>
  )
}
