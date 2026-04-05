"use client"
import * as React from "react"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "~/components/ui/button"
import { useCart } from "~/store/cart"
import { Link } from "~/i18n/routing"

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  price: string;
  category: string;
  isNewProd: boolean | null;
}

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('Shop')
  const { addItem } = useCart()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="h-full group/card"
    >
      <Link href={`/products/${product.id}`} className="block space-y-6">
        <div className="relative aspect-[4/5] overflow-hidden bg-foreground/[0.03] transition-all duration-700 group-hover/card:bg-foreground/[0.05]">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.nameEn} 
              fill 
              className="object-cover transition-transform duration-1000 ease-out group-hover/card:scale-105 opacity-80 group-hover/card:opacity-100 grayscale hover:grayscale-0" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-foreground/10" />
            </div>
          )}

          {/* Minimal Price Tag */}
          <div className="absolute bottom-6 left-6 z-20">
             <span className="text-sm font-bold text-foreground uppercase tracking-widest bg-background px-4 py-2">
                {product.price}
             </span>
          </div>

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 z-10 bg-background/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <Button 
                variant="outline"
                className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background h-12 px-8 text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    productId: product.id,
                    name: product.nameEn,
                    price: product.price
                  })
                }}
            >
                {t('addToCart')}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground transition-all duration-500">
              {product.nameEn}
            </h3>
          </div>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">
            {product.nameAr}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
