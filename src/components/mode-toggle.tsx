"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

export function ModeToggle() {
  const t = useTranslations("Nav")
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/0 px-2 opacity-0 select-none">
        {t("theme")}
      </button>
    )
  }

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
      className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors px-2 relative"
    >
      {theme === "dark" ? t("themeLight") : t("themeDark")}
    </button>
  )
}
