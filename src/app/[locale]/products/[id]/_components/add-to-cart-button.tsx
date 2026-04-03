"use client"
import { Button } from "~/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { useCart } from "~/store/cart"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useState } from "react"

export interface Product {
  id: string;
  nameEn: string;
  price: string;
}

export function AddToCartButton({ product }: { product: Product }) {
  const t = useTranslations('Shop')
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    setIsAdding(true)
    setTimeout(() => {
        addItem({
            productId: product.id,
            name: product.nameEn,
            price: product.price
        })
        toast.success(t('addedToCart'))
        setIsAdding(false)
    }, 600)
  }

  return (
    <Button 
        onClick={handleAdd}
        disabled={isAdding}
        className="flex-1 h-20 rounded-[2rem] btn-premium text-white text-2xl font-black shadow-3xl hover:shadow-primary/20 flex items-center justify-center gap-4"
    >
      {isAdding ? (
          <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
          <ShoppingBag className="h-8 w-8" />
      )}
      {t('addToCart')}
    </Button>
  )
}
