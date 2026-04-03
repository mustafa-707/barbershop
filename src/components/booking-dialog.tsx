"use client"
import * as React from "react"
import { Button } from "~/components/ui/button"
import { CalendarDays, Check, User, Phone as PhoneIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"

import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from "framer-motion"

export function BookingDialog() {
  const t = useTranslations('Booking')
  const common = useTranslations('Common')
  const [open, setOpen] = React.useState(false)
  const { data: session } = useSession()
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [date, setDate] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name)
      // phone pre-filling logic if available in sub-session or db
    }
  }, [session, name])

  const createBooking = api.booking.create.useMutation({
    onSuccess: () => {
      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setName("")
        setPhone("")
        setDate("")
      }, 3000)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !date) return
    
    createBooking.mutate({
      guestName: name,
      guestPhone: phone,
      bookingTime: new Date(date),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
        >
          <Button size="lg" className="rounded-full shadow-2xl h-16 px-10 text-xl btn-premium text-white border border-white/10">
            <CalendarDays className="mr-3 h-6 w-6 text-black" />
            {t('cta')}
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="glass dark:glass-dark sm:max-w-[500px] rounded-[3rem] border-white/10 p-0 overflow-hidden shadow-3xl">
        <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-16 flex flex-col items-center text-center space-y-8 min-h-[400px] justify-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-24 w-24 bg-primary text-black rounded-full flex items-center justify-center shadow-2xl"
            >
              <Check className="h-14 w-14" />
            </motion.div>
            <div className="space-y-3">
              <DialogTitle className="text-3xl font-black uppercase tracking-tight">{t('successTitle')}</DialogTitle>
              <DialogDescription className="text-xl opacity-80 font-medium">
                {t('successDescription')}
              </DialogDescription>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-10 md:p-14 space-y-10"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                <CalendarDays className="w-3.5 h-3.5" />
                {t('cta')}
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="text-4xl font-black tracking-tighter leading-tight">{t('title')}</DialogTitle>
                <DialogDescription className="text-lg opacity-70 font-medium pt-2">
                  {t('description')}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-primary/80 pl-1">{t('fullName')}</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="John Doe" 
                      className="bg-foreground/5 border-foreground/10 h-14 rounded-2xl text-lg pl-12 pr-6 focus:ring-4 ring-primary/20 transition-all font-medium text-foreground" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-black uppercase tracking-widest text-primary/80 pl-1">{t('phone')}</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="+962 7..." 
                      required 
                      className="bg-foreground/5 border-foreground/10 h-14 rounded-2xl text-lg pl-12 pr-6 focus:ring-4 ring-primary/20 transition-all font-medium text-foreground" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="datetime" className="text-sm font-black uppercase tracking-widest text-primary/80 pl-1">{t('dateTime')}</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input 
                      id="datetime" 
                      type="datetime-local" 
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                      required 
                      className="bg-foreground/5 border-foreground/10 h-14 rounded-2xl text-lg pl-12 pr-6 focus:ring-4 ring-primary/20 transition-all font-medium text-foreground [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-18 text-xl font-black uppercase tracking-widest btn-premium text-black rounded-2xl shadow-3xl disabled:opacity-50" 
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? common('requesting') : t('submit')}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
