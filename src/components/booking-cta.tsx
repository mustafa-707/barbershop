"use client"
import * as React from "react"
import { useTranslations } from "next-intl"
import { motion, useScroll, useTransform } from "framer-motion"
import { BookingDialog } from "./booking-dialog"
import { api } from "~/trpc/react"

export function BookingCta() {
  const t = useTranslations('Hero')
  const { data: settings } = api.settings.get.useQuery()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])

  const heroImage = settings?.heroImageUrl || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"

  return (
    <section className="relative w-full py-40 md:py-60 overflow-hidden bg-background">
      {/* Background Image - Subtle & Refined */}
      <motion.div 
        style={{ y: y1, backgroundImage: `url(${heroImage})` }}
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.4] grayscale dark:opacity-[0.2]" 
      />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-6 flex flex-col items-center text-center space-y-12">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="space-y-8"
        >
          <span className="text-primary text-[10px] font-black tracking-[0.6em] uppercase block">
            {t('badge')}
          </span>
          <h1 className="text-6xl md:text-[8rem] font-bold tracking-tight text-foreground uppercase leading-[0.9] max-w-5xl mx-auto">
            {t('title')}
          </h1>
          <p className="text-sm md:text-lg text-foreground/40 font-medium max-w-2xl mx-auto tracking-widest uppercase">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5, duration: 1 }}
        >
          <BookingDialog />
        </motion.div>
      </div>
    </section>
  )
}
