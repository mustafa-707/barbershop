import postgres from 'postgres';
const sql = postgres("postgresql://postgres.eicmxruozzjpoobejzjo:6Lv3v71MdneywXzw@aws-1-eu-central-1.pooler.supabase.com:6543/postgres");

async function run() {
  try {
    console.log("Creating barber_service table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "barber_service" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "nameEn" varchar(255) NOT NULL,
        "nameAr" varchar(255) NOT NULL,
        "descriptionEn" text,
        "descriptionAr" text,
        "price" varchar(255) NOT NULL,
        "duration" integer DEFAULT 30,
        "imageUrl" varchar(512),
        "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
        "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    console.log("Creating barber_barber table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "barber_barber" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "nameEn" varchar(255) NOT NULL,
        "nameAr" varchar(255) NOT NULL,
        "imageUrl" varchar(512),
        "descriptionEn" text,
        "descriptionAr" text,
        "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
        "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    console.log("Adding columns to barber_booking...");
    await sql`ALTER TABLE "barber_booking" ADD COLUMN IF NOT EXISTS "serviceId" uuid REFERENCES "barber_service"("id") ON DELETE SET NULL;`;
    await sql`ALTER TABLE "barber_booking" ADD COLUMN IF NOT EXISTS "barberId" uuid REFERENCES "barber_barber"("id") ON DELETE SET NULL;`;

    console.log("Adding columns to barber_setting...");
    await sql`ALTER TABLE "barber_setting" ADD COLUMN IF NOT EXISTS "heroImageUrl" varchar(512);`;
    await sql`ALTER TABLE "barber_setting" ADD COLUMN IF NOT EXISTS "aboutImageUrl" varchar(512);`;

    console.log("Migration complete!");
  } catch (e) {
    console.error("Migration failed:", e.message);
  }
  process.exit(0);
}
run();
