import postgres from 'postgres';
const sql = postgres("postgresql://postgres.eicmxruozzjpoobejzjo:6Lv3v71MdneywXzw@aws-1-eu-central-1.pooler.supabase.com:6543/postgres");
async function run() {
  try {
    const res = await sql`ALTER TABLE "barber_user" ADD COLUMN "hashedPassword" varchar(255);`;
    console.log("Success sql", res);
  } catch (e) { 
    console.error(e instanceof Error ? e.message : String(e)) 
  }
  process.exit(0);
}
run();
