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
      <div className="flex flex-col min-h-screen bg-vibrant-gradient">
        {/* Booking CTA Section */}
        <BookingCta />

        <div className="container mx-auto max-w-7xl px-4 py-20 space-y-32">
          {/* Latest Products Carousel */}
          <section className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-primary pl-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">{t('latest')}</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-primary to-transparent opacity-20 hidden md:block" />
            </div>
            <ProductCarousel products={products} />
          </section>

          {/* All Products Grid */}
          <section className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-primary/40 pl-8">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">{t('collection')}</h2>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/40 to-transparent opacity-10 hidden md:block" />
            </div>
            <ProductGrid />
          </section>
        </div>
      </div>
    </HydrateClient>
  );
}
