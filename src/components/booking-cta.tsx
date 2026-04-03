"use client"
import * as React from "react"
import { useTranslations } from "next-intl"
import { motion, useScroll, useTransform } from "framer-motion"
import { BookingDialog } from "./booking-dialog"

export function BookingCta() {
  const t = useTranslations('Hero')
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])

  return (
    <section className="relative w-full py-32 md:py-72 overflow-hidden bg-slate-950 transition-colors duration-700">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 contrast-[1.1] grayscale brightness-[0.4] hover:grayscale-0 transition-all duration-1000" 
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-background/90 via-transparent to-background" />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-4 flex flex-col items-center text-center space-y-16">
        <motion.div
           initial={{ opacity: 0, y: 60 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className="space-y-10"
        >
          <div className="inline-flex items-center gap-4">
            <div className="h-[1px] w-12 bg-primary/40" />
            <span className="text-primary text-xs font-black tracking-[0.5em] uppercase">
              EST. 1990 • AMMAN
            </span>
            <div className="h-[1px] w-12 bg-primary/40" />
          </div>
          <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter mb-8 text-white leading-[0.75] uppercase drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {t('title').split(' ').map((word, i) => (
              <span key={i} className={i > 2 ? "text-primary drop-shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-pulse-slow" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-xl md:text-3xl text-white/50 font-bold max-w-3xl mx-auto leading-relaxed tracking-wide uppercase">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <BookingDialog />
        </motion.div>
      </div>
    </section>
  )
}
