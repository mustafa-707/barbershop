"use client"
import * as React from "react"
import { Button } from "~/components/ui/button"
import { CalendarDays, Check, User, Phone as PhoneIcon, Scissors, User as UserIcon, Loader2 } from "lucide-react"
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
import { useParams } from "next/navigation"

export function BookingDialog() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('Booking')
  const common = useTranslations('Common')
  const [open, setOpen] = React.useState(false)
  const { data: session } = useSession()
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [date, setDate] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const { data: services } = api.service.getAll.useQuery()
  const { data: barbers } = api.barber.getAll.useQuery()
  const [serviceId, setServiceId] = React.useState<string | null>(null)
  const [barberId, setBarberId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name)
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
        setServiceId(null)
        setBarberId(null)
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
      serviceId,
      barberId
    })
  }

  const isRtl = locale === 'ar'
  const isAr = isRtl

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          asChild
          size="lg" 
          className="rounded-none h-16 px-12 text-[10px] font-black uppercase tracking-[0.4em] bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <motion.button whileTap={{ scale: 0.98 }}>
            {t('cta')}
          </motion.button>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 border-none bg-background overflow-y-auto max-h-[90vh] rounded-none shadow-2xl custom-scrollbar">
        <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
               <Check className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">{t('successTitle')}</h2>
              <p className="text-foreground/60 max-w-xs mx-auto">{t('successDescription')}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 md:p-12 space-y-6 md:space-y-10"
          >
            <DialogHeader className={isRtl ? "text-right" : "text-left"}>
              <DialogTitle className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">{t('title')}</DialogTitle>
              <DialogDescription className="text-sm text-foreground/40 leading-relaxed max-w-sm mt-4">
                {t('description')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
              <div className="grid gap-4 md:gap-10">
                {/* Visual Service Selection */}
                {services && services.length > 0 && (
                  <div className="space-y-6">
                    <Label className={`text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 block ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t('selectService')}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setServiceId(service.id === serviceId ? null : service.id)}
                          className={`p-5 text-left border transition-all flex items-center justify-between group rounded-[2rem] ${
                            serviceId === service.id 
                            ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]" 
                            : "bg-foreground/[0.03] border-transparent hover:bg-foreground/[0.06]"
                          }`}
                        >
                          <div className={`space-y-1 ${isRtl ? 'order-2 text-right' : 'order-1'}`}>
                            <div className="font-black uppercase tracking-tight text-sm">
                              {isAr ? service.nameAr : service.nameEn}
                            </div>
                            <div className={`text-[10px] font-medium opacity-60 ${serviceId === service.id ? 'text-white' : ''}`}>
                              {service.price} • {service.duration} {common('minutes')}
                            </div>
                          </div>
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                             serviceId === service.id ? "bg-white/20" : "bg-primary/10 text-primary group-hover:bg-primary/20"
                          } ${isRtl ? 'order-1' : 'order-2'}`}>
                             <Scissors className="h-5 w-5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Barber Selection */}
                {barbers && barbers.length > 0 && (
                  <div className="space-y-6">
                    <Label className={`text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 block ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t('selectBarber')}
                    </Label>
                    <div className="flex flex-wrap gap-4 justify-start">
                      {barbers.map((barber) => (
                        <button
                          key={barber.id}
                          type="button"
                          onClick={() => setBarberId(barber.id === barberId ? null : barber.id)}
                          className={`flex flex-col items-center gap-3 transition-all group ${
                            barberId === barber.id ? "scale-110" : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className={`w-20 h-20 rounded-full border-2 p-1 transition-all ${
                            barberId === barber.id ? "border-primary shadow-xl" : "border-transparent"
                          }`}>
                            <div className="w-full h-full rounded-full overflow-hidden bg-foreground/5 relative">
                              {barber.imageUrl ? (
                                <img src={barber.imageUrl} alt={barber.nameEn} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-foreground/20">
                                   <UserIcon className="h-8 w-8" />
                                </div>
                              )}
                              {barberId === barber.id && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                   <Check className="h-8 w-8 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${barberId === barber.id ? 'text-primary' : 'text-muted-foreground'}`}>
                            {isAr ? barber.nameAr : barber.nameEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="name" className={`text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('fullName')}</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="E.G. ABDULLAH"                      className={`border-none bg-foreground/[0.03] h-16 rounded-none text-base px-4 md:px-8 focus:ring-1 focus:ring-primary/20 focus:bg-background transition-all font-medium ${isRtl ? 'text-right' : 'text-left'}`} 
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="phone" className={`text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('phone')}</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="+962 ..." 
                      required 
                      className={`border-none bg-foreground/[0.03] h-16 rounded-none text-base px-4 md:px-8 focus:ring-1 focus:ring-primary/20 focus:bg-background transition-all font-medium ${isRtl ? 'text-right' : 'text-left'}`} 
                      dir="ltr"
                    />
                  </div>
                </div>
 
                <div className="space-y-4">
                  <Label htmlFor="datetime" className={`text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('dateTime')}</Label>
                  <Input 
                    id="datetime" 
                    type="datetime-local" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required 
                    className={`border-none bg-foreground/[0.03] h-16 rounded-none text-base px-4 md:px-8 focus:ring-1 focus:ring-primary/20 focus:bg-background transition-all font-medium [&::-webkit-datetime-edit-placeholder-text]:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`} 
                  />
                </div>
              </div>
              <div className="pt-8">
                <Button 
                  asChild
                  type="submit" 
                  className="w-full h-20 text-[12px] font-black uppercase tracking-[0.4em] bg-primary text-primary-foreground rounded-none hover:opacity-90 transition-opacity shadow-2xl" 
                  disabled={createBooking.isPending}
                >
                  <motion.button whileTap={{ scale: 0.98 }}>
                    {createBooking.isPending ? (
                      <div className="flex items-center gap-3">
                         <Loader2 className="h-5 w-5 animate-spin" />
                         {common('requesting')}
                      </div>
                    ) : t('submit')}
                  </motion.button>
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
