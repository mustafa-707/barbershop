CREATE TYPE "public"."booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "barber_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "barber_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "barber_booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255),
	"guestName" varchar(255),
	"guestPhone" varchar(255),
	"bookingTime" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255),
	"guestName" varchar(255),
	"guestPhone" varchar(255),
	"status" "order_status" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nameEn" varchar(255) NOT NULL,
	"nameAr" varchar(255) NOT NULL,
	"descriptionEn" text NOT NULL,
	"descriptionAr" text NOT NULL,
	"imageUrl" varchar(512) NOT NULL,
	"price" varchar(255) DEFAULT '5 JOD' NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"isNewProd" boolean DEFAULT true,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_setting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"siteNameEn" varchar(255) DEFAULT 'BarberShop',
	"siteNameAr" varchar(255) DEFAULT 'صالون الحلاقة',
	"contactPhone" varchar(255),
	"contactEmail" varchar(255),
	"mapUrl" text,
	"logoUrl" varchar(512),
	"faviconUrl" varchar(512),
	"descriptionEn" text,
	"descriptionAr" text,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"phone" varchar(255),
	"email" varchar(255),
	"emailVerified" timestamp with time zone,
	"image" varchar(255),
	"role" "role" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "barber_account" ADD CONSTRAINT "barber_account_userId_barber_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."barber_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_booking" ADD CONSTRAINT "barber_booking_userId_barber_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."barber_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_order_item" ADD CONSTRAINT "barber_order_item_orderId_barber_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."barber_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_order_item" ADD CONSTRAINT "barber_order_item_productId_barber_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."barber_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_order" ADD CONSTRAINT "barber_order_userId_barber_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."barber_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_session" ADD CONSTRAINT "barber_session_userId_barber_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."barber_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "barber_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "barber_session" USING btree ("userId");