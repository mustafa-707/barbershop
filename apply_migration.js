import postgres from 'postgres';
const sql = postgres("postgresql://postgres.eicmxruozzjpoobejzjo:6Lv3v71MdneywXzw@aws-1-eu-central-1.pooler.supabase.com:6543/postgres");
async function run() {
  try {
    console.log("Adding columns to barber_setting...");
    await sql`ALTER TABLE "barber_setting" ADD COLUMN IF NOT EXISTS "primaryColor" varchar(255) DEFAULT '#C5A059';`;
    await sql`ALTER TABLE "barber_setting" ADD COLUMN IF NOT EXISTS "secondaryColor" varchar(255) DEFAULT '#1e293b';`;
    await sql`ALTER TABLE "barber_setting" ADD COLUMN IF NOT EXISTS "backgroundColor" varchar(255) DEFAULT '#020617';`;
    await sql`ALTER TABLE "barber_setting" ADD COLUMN IF NOT EXISTS "textColor" varchar(255) DEFAULT '#f8fafc';`;
    await sql`ALTER TABLE "barber_setting" ADD COLUMN IF NOT EXISTS "radius" varchar(255) DEFAULT '0.5rem';`;
    
    console.log("Creating barber_translation table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "barber_translation" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "key" varchar(255) NOT NULL,
        "en" text,
        "ar" text,
        "category" varchar(255),
        "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS "translation_key_idx" ON "barber_translation" ("key");`;
    
    console.log("Migration complete!");
  } catch (e) { 
    console.error("Migration failed:", e.message);
  }
  process.exit(0);
}
run();
