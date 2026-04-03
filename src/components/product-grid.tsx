"use client"
import * as React from "react"
import { Search, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { api } from "~/trpc/react"
import { useCart } from "~/store/cart"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Skeleton } from "~/components/ui/skeleton"
import { ProductCard } from "./product-card"
import { cn } from "~/lib/utils" // Added this import as it's used in the snippet

export function ProductGrid() {
  const t = useTranslations('Shop')
  const common = useTranslations('Common')
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [search, setSearch] = React.useState("")
  
  const categories = ["all", "hair", "beard", "tools"]

  const { data: products, isLoading } = api.product.getAll.useQuery()

  const filteredProducts = products?.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category.toLowerCase() === activeCategory
    const matchesSearch = p.nameEn.toLowerCase().includes(search.toLowerCase()) || 
                         p.nameAr.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-16">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between glass-dark p-10 md:p-14 rounded-[4rem] border border-white/10 shadow-3xl">
        <div className="flex flex-wrap gap-4 p-3 bg-white/5 rounded-[2rem] border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-10 py-7 text-sm font-black uppercase tracking-[0.2em] transition-all duration-500",
                activeCategory === cat 
                  ? "bg-primary text-black shadow-[0_20px_50px_rgba(var(--primary),0.4)] scale-110" 
                  : "bg-transparent border-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/10"
              )}
            >
              {t(`categories.${cat}`)}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-[450px] shadow-3xl rounded-[2rem] overflow-hidden group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-7 w-7 text-primary transition-transform duration-500 group-focus-within:scale-110" />
          <Input 
            placeholder={common('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-20 h-20 bg-foreground/5 border-foreground/10 rounded-[2rem] focus:ring-8 ring-primary/5 text-2xl font-black text-foreground placeholder:text-foreground/40 transition-all duration-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
        <AnimatePresence mode="popLayout">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="aspect-[4/5] w-full rounded-[2.5rem] bg-foreground/5" />
              <div className="space-y-4 pt-6">
                <Skeleton className="h-8 w-2/3 mx-auto rounded-full bg-foreground/5" />
                <Skeleton className="h-4 w-1/2 mx-auto rounded-full bg-foreground/5" />
              </div>
            </div>
          ))
        ) : (
          filteredProducts
            ?.filter(p => activeCategory === "all" || p.category.toLowerCase() === activeCategory)
            .map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product as import("./product-card").Product} />
              </motion.div>
            ))
        )}
        </AnimatePresence>
      </div>

      {!isLoading && filteredProducts?.length === 0 && (
        <div className="text-center py-40 space-y-8">
          <div className="relative inline-block">
             <ShoppingBag className="h-32 w-32 mx-auto opacity-5 animate-float" />
          </div>
          <p className="text-3xl font-black text-muted-foreground uppercase tracking-widest opacity-30">{t('noProducts')}</p>
        </div>
      )}
    </div>
  )
}
