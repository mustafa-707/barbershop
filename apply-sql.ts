import { db } from "./src/server/db/index";
import { sql } from "drizzle-orm";

async function run() {
    try {
        await db.execute(sql`ALTER TABLE "barber_user" ADD COLUMN "hashedPassword" varchar(255);`);
        console.log("Success add hashedPassword");
    } catch (e: any) {
        console.log("Error add hashedPassword", e.message);
    }
    process.exit(0);
}
run();
