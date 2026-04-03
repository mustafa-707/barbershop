import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { products, settings } from "~/server/db/schema";

export async function GET() {
  try {
    // Seed Settings
    await db.insert(settings).values({
      siteNameEn: "Barber Shop Amman",
      siteNameAr: "صالون الحلاقة عمان",
      contactPhone: "+962 7 9876 5432",
      contactEmail: "info@barberamman.com",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108427.09118506256!2d35.84594689617267!3d31.95468758652011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca073b9e4b7b3%3A0x6bba2e951be19e7e!2sAmman%2C%20Jordan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
    }).onConflictDoNothing();

    // Seed Products
    await db.insert(products).values([
      {
        nameEn: "Premium Hair Wax",
        nameAr: "واكس شعر فاخر",
        descriptionEn: "High hold, matte finish hair wax.",
        descriptionAr: "واكس شعر بثبات قوي ولمعة مطفية.",
        imageUrl: "https://images.unsplash.com/photo-1593702275677-f916c8c7604d?auto=format&fit=crop&q=80&w=800",
        quantity: 50,
        category: "hair",
        isNewProd: true,
      },
      {
        nameEn: "Organic Beard Oil",
        nameAr: "زيت لحية عضوي",
        descriptionEn: "Softens beard and hydrates skin.",
        descriptionAr: "ينعم اللحية ويرطب البشرة.",
        imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
        quantity: 30,
        category: "beard",
        isNewProd: true,
      },
      {
        nameEn: "Professional Shaving Cream",
        nameAr: "كريم حلاقة احترافي",
        descriptionEn: "Rich lather for a smooth shave.",
        descriptionAr: "رغوة غنية لحلاقة ناعمة.",
        imageUrl: "https://images.unsplash.com/photo-1512690196236-407425178657?auto=format&fit=crop&q=80&w=800",
        quantity: 20,
        category: "beard",
        isNewProd: false,
      },
      {
        nameEn: "Handcrafted Styling Comb",
        nameAr: "مشط تصفيف يدوي",
        descriptionEn: "Anti-static, heat resistant comb.",
        descriptionAr: "مشط مضاد للكهرباء الساكنة ومقاوم للحرارة.",
        imageUrl: "https://images.unsplash.com/photo-1599351431247-f579302c5be0?auto=format&fit=crop&q=80&w=800",
        quantity: 100,
        category: "tools",
        isNewProd: true,
      }
    ]).onConflictDoNothing();

    return NextResponse.json({ message: "Seeding successful" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
