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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="h-full group/card"
    >
      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass dark:glass-dark border border-foreground/5 transition-all duration-700 group-hover/card:border-primary/40 group-hover/card:shadow-[0_40px_100px_-20px_rgba(var(--primary),0.2)]">
        {/* Minimal Image */}
        {product.imageUrl ? (
          <Image 
            src={product.imageUrl} 
            alt={product.nameEn} 
            fill 
            className="object-cover transition-transform duration-1000 ease-out group-hover/card:scale-110 opacity-70 group-hover/card:opacity-100" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-foreground/5">
            <ShoppingBag className="w-12 h-12 text-foreground/20" />
          </div>
        )}

        {/* Floating Minimal Price */}
        <div className="absolute top-8 right-8 z-20">
           <span className="text-xl font-black text-primary tracking-tighter drop-shadow-2xl">
              {product.price}
           </span>
        </div>

        {/* Hover Overlay: Minimal Add to Cart */}
        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
            <Button 
                className="w-full h-16 btn-premium shadow-2xl scale-90 group-hover/card:scale-100 transition-transform duration-500"
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    productId: product.id,
                    name: product.nameEn,
                    price: product.price
                  })
                }}
            >
                <ShoppingBag className="w-5 h-5 mr-3" />
                {t('addToCart')}
            </Button>
            <Link href={`/products/${product.id}`} className="mt-6 text-foreground/50 hover:text-primary text-xs font-black tracking-[0.3em] uppercase transition-all duration-300 hover:tracking-[0.4em]">
               {t('viewDetails')}
            </Link>
        </div>

        {/* NEW Badge (Tiny Dot/Line style) */}
        {product.isNewProd && (
           <div className="absolute top-10 left-10 h-3 w-3 bg-primary rounded-full shadow-gold animate-pulse-slow" />
        )}
      </div>

      <div className="pt-8 pb-4 text-center space-y-2">
         <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover/card:text-primary transition-all duration-500 uppercase">
           {product.nameEn}
         </h3>
         <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.4em] transition-all duration-500 group-hover/card:text-foreground/70">
           {product.nameAr}
         </p>
      </div>
    </motion.div>
  )
}
