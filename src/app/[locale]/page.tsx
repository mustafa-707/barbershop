import { HydrateClient, api } from "~/trpc/server";
import { BookingCta } from "~/components/booking-cta";
import { ProductCarousel } from "~/components/product-carousel";
import { ProductGrid } from "~/components/product-grid";
import { getTranslations } from "next-intl/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations('Shop');
  
  // Prefetch products for the carousel
  const products = await api.product.getAll();

  return (
    <HydrateClient>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Booking CTA Section */}
        <BookingCta />

        <div className="container mx-auto max-w-7xl px-6 py-32 space-y-48">
          {/* Latest Products Carousel */}
          <section className="space-y-16">
            <ProductCarousel 
              products={products} 
              title={t('latest')} 
              subtitle={t('newArrivals')} 
            />
          </section>

          {/* All Products Grid */}
          <section className="space-y-16">
            <div className="flex flex-col md:flex-row items-baseline justify-between gap-6">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase text-foreground">{t('collection')}</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">{t('shopAll')}</span>
            </div>
            <ProductGrid />
          </section>
        </div>
      </div>
    </HydrateClient>
  );
}
