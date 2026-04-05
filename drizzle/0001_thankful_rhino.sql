ALTER TABLE "barber_product" ADD COLUMN "category" varchar(255) DEFAULT 'Tools' NOT NULL;--> statement-breakpoint
ALTER TABLE "barber_setting" ADD COLUMN "openingHoursEn" varchar(255) DEFAULT 'Mon-Sat: 10AM - 9PM | Sun: Closed';--> statement-breakpoint
ALTER TABLE "barber_setting" ADD COLUMN "openingHoursAr" varchar(255) DEFAULT 'الإثنين-السبت: ١٠ص - ٩م | الأحد: مغلق';--> statement-breakpoint
ALTER TABLE "barber_user" ADD COLUMN "hashedPassword" varchar(255);