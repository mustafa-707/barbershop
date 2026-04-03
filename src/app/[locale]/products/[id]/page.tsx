import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { AddToCartButton } from "./_components/add-to-cart-button";
import { ShoppingBag, ChevronLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations('Shop');

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) {
    notFound();
  }

  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionEn;

  return (
    <div className="min-h-screen bg-vibrant-gradient pt-24 pb-20">
      <div className="container mx-auto max-w-7xl px-4">
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-xs text-white/50 hover:text-primary transition-colors mb-12 group"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 text-primary" />
          {t('backToHome')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <div className="glass dark:glass-dark rounded-[4rem] overflow-hidden border border-white/10 shadow-3xl aspect-square relative group">
            <div className="relative aspect-square rounded-[4rem] overflow-hidden glass dark:glass-dark group">
              <Image
                src={product.imageUrl ?? "/placeholder-product.jpg"}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="absolute top-10 right-10 flex flex-col gap-4">
                 {product.isNewProd && (
                    <div className="px-6 py-2 bg-primary text-primary-foreground text-xs font-black rounded-full uppercase tracking-[0.2em] shadow-2xl animate-float">
                        NEW
                    </div>
                )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4 text-white uppercase">{name}</h1>
              <div className="flex items-center gap-4 text-primary font-black tracking-[0.3em] uppercase text-xs">
                <ShieldCheck className="h-6 w-6" />
                Genuine Quality
              </div>
            </div>

            <div className="glass-dark p-10 md:p-14 rounded-[3.5rem] border border-white/10 space-y-8 shadow-3xl">
                <p className="text-2xl font-medium leading-relaxed text-white/80">
                {description}
                </p>
                
                <div className="flex items-center gap-12 pt-10 border-t border-white/10">
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">In Stock</p>
                        <p className="text-3xl font-black text-white">{product.quantity} <span className="text-lg text-white/40">Units</span></p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Price</p>
                        <p className="text-4xl font-black text-primary drop-shadow-[0_10px_20px_rgba(var(--primary),0.3)]">{product.price}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-6">
                <AddToCartButton product={product} />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-10">
                <div className="glass p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase">Fast Delivery</p>
                        <p className="text-xs opacity-60">Within 24 Hours</p>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase">Secure Store</p>
                        <p className="text-xs opacity-60">Verified Business</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
