"use client"
import * as React from "react"
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "~/store/cart"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"

import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from "framer-motion"

export function CartSheet() {
  const t = useTranslations('Shop')
  const common = useTranslations('Common')
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  // Hydration safety for Zustand persist
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const [isOpen, setIsOpen] = React.useState(false)
  
  const { data: session } = useSession()
  
  const [guestName, setGuestName] = React.useState("")
  const [guestPhone, setGuestPhone] = React.useState("")

  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name && !guestName) setGuestName(session.user.name)
      if (session.user.phone && !guestPhone) setGuestPhone(session.user.phone)
    }
  }, [session, guestName, guestPhone])

  const createOrder = api.order.create.useMutation({
    onSuccess: () => {
      alert(t('orderSuccess'))
      clearCart()
      setIsOpen(false)
    },
    onError: (err) => {
      alert(t('orderFailed') + ": " + err.message)
    }
  })

  const handleSubmit = () => {
    createOrder.mutate({
      guestName,
      guestPhone,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-black/5 dark:bg-white/5 border-transparent hover:border-border rounded-full h-11 w-11">
          <ShoppingBag className="h-6 w-6 text-primary" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="sr-only">{t('openCart')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="glass dark:glass-dark w-full sm:max-w-md flex flex-col border-l border-white/10 p-0 overflow-hidden">
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="text-2xl font-bold">{t('yourCart')}</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence mode="popLayout">
          {!mounted || items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4"
            >
              <ShoppingBag className="h-12 w-12 opacity-20" />
              <p className="text-lg">{t('emptyCart')}</p>
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div 
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between gap-4 bg-white/5 dark:bg-black/20 p-4 rounded-2xl border border-white/10 glass-card"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-base">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-full px-2 py-1 border border-white/5">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-white/10 bg-white/5 text-primary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-white/10 bg-white/5 text-primary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.productId)}>
                      <Trash2 className="h-4 w-4 text-primary" />
                    </Button>
                </div>
              </motion.div>
            ))
          )}
          </AnimatePresence>
        </div>

        {mounted && items.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="p-6 space-y-6 border-t border-white/10 bg-black/5 dark:bg-white/5"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cart-name" className="text-sm font-medium">{t('nameOptional')}</Label>
                <Input id="cart-name" placeholder="John Doe" value={guestName} onChange={e => setGuestName(e.target.value)} className="bg-background/50 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cart-phone" className="text-sm font-medium">{t('phone')}</Label>
                <Input id="cart-phone" placeholder="+962 7..." value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="bg-background/50 h-12 rounded-xl" />
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg btn-premium text-white shadow-xl" 
              size="lg" 
              disabled={!mounted || items.length === 0 || createOrder.isPending || (guestPhone.length < 5)} 
              onClick={handleSubmit}
            >
              {createOrder.isPending ? common('submitting') : t('submitOrder')}
            </Button>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  )
}
