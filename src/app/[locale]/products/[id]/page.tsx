"use client"
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useTranslations } from "next-intl";
import { AddToCartButton } from "./_components/add-to-cart-button";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { Link } from "~/i18n/routing";
import { motion } from "framer-motion";

export default function ProductPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const t = useTranslations('Shop');

  const { data: product, isLoading } = api.product.getById.useQuery({ id });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Loading...</div>;
  if (!product) notFound();

  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionEn;

  return (
    <div className="min-h-screen bg-background pt-32 pb-40">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-20">
          <Link 
            href="/" 
            className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 hover:text-primary transition-all group"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t('backToHome')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Image Section - Editorial Style */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] bg-foreground/[0.02] border border-foreground/[0.05] overflow-hidden"
          >
            <Image
              src={product.imageUrl ?? "/placeholder-product.jpg"}
              alt={name}
              fill
              className="object-cover"
              priority
            />
            {product.isNewProd && (
              <div className="absolute top-8 left-8 z-10">
                <span className="bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] border border-foreground/10">
                  NEW
                </span>
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="space-y-16 py-12"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block">
                {product.category}
              </span>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] text-foreground">
                {name}
              </h1>
              <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.3em] block">
                {locale === 'ar' ? product.nameEn : product.nameAr}
              </p>
            </div>

            <div className="space-y-8">
              <p className="text-xl text-foreground font-medium leading-relaxed opacity-60">
                {description}
              </p>
              
              <div className="flex items-baseline gap-8 pt-8 border-t border-foreground/5">
                <span className="text-5xl font-bold tracking-tighter text-foreground">
                  {product.price}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
                  Tax Included
                </span>
              </div>
            </div>

            <div className="space-y-12">
              <AddToCartButton product={product as any} />
              
              <div className="grid grid-cols-2 gap-12 pt-12 border-t border-foreground/5">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Availability</span>
                  <p className="text-xs font-bold uppercase tracking-widest">{product.quantity > 0 ? `In Stock (${product.quantity})` : 'Out of Stock'}</p>
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Shipping</span>
                  <p className="text-xs font-bold uppercase tracking-widest">Global Express</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
