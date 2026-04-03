import { db } from "./src/server/db/index.js";
import { products, settings } from "./src/server/db/schema.js";

async function seed() {
  console.log("Seeding began...");

  // Seed Settings
  await db.insert(settings).values({
    siteNameEn: "Barber Shop Amman",
    siteNameAr: "صالون الحلاقة عمان",
    contactPhone: "+962 7 9876 5432",
    contactEmail: "info@barberamman.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108427.09118506256!2d35.84594689617267!3d31.95468758652011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca073b9e4b7b3%3A0x6bba2e951be19e7e!2sAmman%2C%20Jordan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  });

  // Seed Products
  await db.insert(products).values([
    {
      nameEn: "Premium Hair Wax",
      nameAr: "واكس شعر فاخر",
      descriptionEn: "High hold, matte finish hair wax.",
      descriptionAr: "واكس شعر بثبات قوي ولمعة مطفية.",
      imageUrl: "https://images.unsplash.com/photo-1599351431247-f579302c5be0?q=80&w=300&auto=format&fit=crop",
      quantity: 50,
      isNewProd: true,
    },
    {
      nameEn: "Organic Beard Oil",
      nameAr: "زيت لحية عضوي",
      descriptionEn: "Softens beard and hydrates skin.",
      descriptionAr: "ينعم اللحية ويرطب البشرة.",
      imageUrl: "https://images.unsplash.com/photo-1626285495645-45a9024d6f8f?q=80&w=300&auto=format&fit=crop",
      quantity: 30,
      isNewProd: true,
    },
    {
      nameEn: "Professional Shaving Cream",
      nameAr: "كريم حلاقة احترافي",
      descriptionEn: "Rich lather for a smooth shave.",
      descriptionAr: "رغوة غنية لحلاقة ناعمة.",
      imageUrl: "https://images.unsplash.com/photo-1585731050162-602fb3950489?q=80&w=300&auto=format&fit=crop",
      quantity: 20,
      isNewProd: false,
    },
    {
      nameEn: "Handcrafted Styling Comb",
      nameAr: "مشط تصفيف يدوي",
      descriptionEn: "Anti-static, heat resistant comb.",
      descriptionAr: "مشط مضاد للكهرباء الساكنة ومقاوم للحرارة.",
      imageUrl: "https://images.unsplash.com/photo-1590540179852-2110a54f813a?q=80&w=300&auto=format&fit=crop",
      quantity: 100,
      isNewProd: true,
    }
  ]);

  console.log("Seeding completed!");
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error("Seeding failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
