import postgres from "postgres";
import { readFileSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";

/**
 * Robust standalone seed script using raw SQL via postgres.js.
 * This avoids all Next.js/tsx/tRPC import chain issues.
 */

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in environment");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { prepare: false });

function flattenMessages(obj: any, prefix = ""): Array<{ key: string; value: string }> {
  const result: Array<{ key: string; value: string }> = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      result.push(...flattenMessages(v, fullKey));
    } else {
      result.push({ key: fullKey, value: String(v) });
    }
  }
  return result;
}

async function run() {
  console.log("🌱 Starting robust seed...");

  try {
    // 1. Initial Admin
    const adminPhone = process.env.ADMIN_PHONE || "+962700000000";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    const [existingAdmin] = await sql`SELECT id FROM barber_user WHERE phone = ${adminPhone}`;
    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO barber_user (id, phone, name, email, "hashedPassword", role)
        VALUES (${id}, ${adminPhone}, ${adminName}, ${'admin@barbershop.com'}, ${hashedPassword}, ${'ADMIN'})
      `;
      console.log(`✅ Admin created: ${adminName}`);
    } else {
      console.log(`⏭️  Admin exists: ${adminPhone}`);
    }

    // 2. Translations
    const en = JSON.parse(readFileSync(resolve("messages/en.json"), "utf-8"));
    const ar = JSON.parse(readFileSync(resolve("messages/ar.json"), "utf-8"));

    const enFlat = flattenMessages(en);
    const arFlat = flattenMessages(ar);
    const arMap = new Map(arFlat.map(t => [t.key, t.value]));

    console.log(`📊 Processing ${enFlat.length} translation keys...`);

    let seeded = 0;
    let skipped = 0;

    for (const entry of enFlat) {
      const [existing] = await sql`SELECT id FROM barber_translation WHERE key = ${entry.key}`;
      if (!existing) {
        const id = crypto.randomUUID();
        const category = entry.key.split('.')[0] || 'General';
        const arVal = arMap.get(entry.key) || '';
        await sql`
          INSERT INTO barber_translation (id, key, en, ar, category)
          VALUES (${id}, ${entry.key}, ${entry.value}, ${arVal}, ${category})
        `;
        seeded++;
      } else {
        skipped++;
      }
    }
    console.log(`✅ Translations: ${seeded} seeded, ${skipped} skipped`);

    // 3. Settings (minimal check)
    const [existingSettings] = await sql`SELECT id FROM barber_setting LIMIT 1`;
    if (!existingSettings) {
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO barber_setting (id, "siteNameEn", "siteNameAr")
        VALUES (${id}, 'Barber Shop Amman', 'صالون الحلاقة عمان')
      `;
      console.log(`✅ Settings seeded`);
    }

    console.log("🎉 Seed complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

run();
