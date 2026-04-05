import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./src/server/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in .env");
  process.exit(1);
}

const conn = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(conn, { schema });

const { products, settings, translations, users } = schema;

const enMessages = JSON.parse(readFileSync(resolve("messages/en.json"), "utf-8")) as Record<string, unknown>;
const arMessages = JSON.parse(readFileSync(resolve("messages/ar.json"), "utf-8")) as Record<string, unknown>;

/**
 * Flatten nested JSON message objects into dot-notation keys.
 * e.g. { Nav: { login: "Login" } } => [{ key: "Nav.login", value: "Login" }]
 */
function flattenMessages(
  obj: Record<string, unknown>,
  prefix = ""
): Array<{ key: string; value: string }> {
  const result: Array<{ key: string; value: string }> = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      result.push(...flattenMessages(v as Record<string, unknown>, fullKey));
    } else {
      result.push({ key: fullKey, value: String(v) });
    }
  }
  return result;
}

async function seed() {
  console.log("🌱 Seeding began...\n");

  // ── 1. Seed Initial Admin (DevOps Step) ──
  const adminPhone = process.env.ADMIN_PHONE ?? "+962700000000";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const adminName = process.env.ADMIN_NAME ?? "Super Admin";

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.phone, adminPhone),
  });

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    await db.insert(users).values({
      phone: adminPhone,
      name: adminName,
      email: `admin@barbershop.com`,
      hashedPassword,
      role: "ADMIN",
    });
    console.log(`✅ Initial admin created: ${adminName} (${adminPhone})`);
  } else {
    console.log(`⏭️  Admin already exists: ${existingAdmin.name} (${adminPhone})`);
  }

  // ── 2. Seed Settings ──
  const existingSettings = await db.query.settings.findFirst();
  if (!existingSettings) {
    await db.insert(settings).values({
      siteNameEn: "Barber Shop Amman",
      siteNameAr: "صالون الحلاقة عمان",
      contactPhone: "+962 7 9876 5432",
      contactEmail: "info@barberamman.com",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108427.09118506256!2d35.84594689617267!3d31.95468758652011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca073b9e4b7b3%3A0x6bba2e951be19e7e!2sAmman%2C%20Jordan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
    });
    console.log("✅ Settings seeded");
  } else {
    console.log("⏭️  Settings already exist");
  }

  // ── 3. Seed Products ──
  const existingProducts = await db.query.products.findMany({ limit: 1 });
  if (existingProducts.length === 0) {
    await db.insert(products).values([
      {
        nameEn: "Premium Hair Wax",
        nameAr: "واكس شعر فاخر",
        descriptionEn: "High hold, matte finish hair wax.",
        descriptionAr: "واكس شعر بثبات قوي ولمعة مطفية.",
        imageUrl:
          "https://images.unsplash.com/photo-1599351431247-f579302c5be0?q=80&w=300&auto=format&fit=crop",
        quantity: 50,
        isNewProd: true,
      },
      {
        nameEn: "Organic Beard Oil",
        nameAr: "زيت لحية عضوي",
        descriptionEn: "Softens beard and hydrates skin.",
        descriptionAr: "ينعم اللحية ويرطب البشرة.",
        imageUrl:
          "https://images.unsplash.com/photo-1626285495645-45a9024d6f8f?q=80&w=300&auto=format&fit=crop",
        quantity: 30,
        isNewProd: true,
      },
      {
        nameEn: "Professional Shaving Cream",
        nameAr: "كريم حلاقة احترافي",
        descriptionEn: "Rich lather for a smooth shave.",
        descriptionAr: "رغوة غنية لحلاقة ناعمة.",
        imageUrl:
          "https://images.unsplash.com/photo-1585731050162-602fb3950489?q=80&w=300&auto=format&fit=crop",
        quantity: 20,
        isNewProd: false,
      },
      {
        nameEn: "Handcrafted Styling Comb",
        nameAr: "مشط تصفيف يدوي",
        descriptionEn: "Anti-static, heat resistant comb.",
        descriptionAr: "مشط مضاد للكهرباء الساكنة ومقاوم للحرارة.",
        imageUrl:
          "https://images.unsplash.com/photo-1590540179852-2110a54f813a?q=80&w=300&auto=format&fit=crop",
        quantity: 100,
        isNewProd: true,
      },
    ]);
    console.log("✅ Products seeded (4 items)");
  } else {
    console.log("⏭️  Products already exist");
  }

  // ── 4. Seed Translations from messages/*.json ──
  const enFlat = flattenMessages(enMessages);
  const arFlat = flattenMessages(arMessages);

  // Build a map of ar translations keyed by key
  const arMap = new Map(arFlat.map((t) => [t.key, t.value]));

  let seededCount = 0;
  let skippedCount = 0;

  for (const entry of enFlat) {
    const category = entry.key.split(".")[0] ?? "General";
    const arValue = arMap.get(entry.key) ?? "";

    // Check if this key already exists
    const existing = await db.query.translations.findFirst({
      where: eq(translations.key, entry.key),
    });

    if (!existing) {
      await db.insert(translations).values({
        key: entry.key,
        en: entry.value,
        ar: arValue,
        category,
      });
      seededCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(
    `✅ Translations seeded: ${seededCount} new, ${skippedCount} already existed`
  );

  console.log("\n🎉 Seeding completed!");
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error("❌ Seeding failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
