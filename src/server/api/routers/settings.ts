import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { settings, users, translations } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.settings.findFirst();
  }),

  update: protectedProcedure
    .input(
      z.object({
        siteNameEn: z.string().min(1),
        siteNameAr: z.string().min(1),
        openingHoursEn: z.string().optional().nullable(),
        openingHoursAr: z.string().optional().nullable(),
        contactPhone: z.string().optional().nullable(),
        contactEmail: z.string().email().optional().nullable().or(z.literal("")),
        mapUrl: z.string().optional().nullable(),
        descriptionEn: z.string().optional().nullable(),
        descriptionAr: z.string().optional().nullable(),
        logoUrl: z.string().optional().nullable(),
        faviconUrl: z.string().optional().nullable(),
        heroImageUrl: z.string().optional().nullable(),
        aboutImageUrl: z.string().optional().nullable(),
        primaryColor: z.string().optional().nullable(),
        secondaryColor: z.string().optional().nullable(),
        backgroundColor: z.string().optional().nullable(),
        textColor: z.string().optional().nullable(),
        radius: z.string().optional().nullable(),
        fontFamily: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const existing = await ctx.db.query.settings.findFirst();
      
      if (existing) {
        return await ctx.db
          .update(settings)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(settings.id, existing.id));
      } else {
        return await ctx.db.insert(settings).values(input);
      }
    }),

  getTranslations: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.translations.findMany({
        orderBy: (translations, { asc }) => [asc(translations.key)],
      });
    }),

  upsertTranslation: protectedProcedure
    .input(z.object({
      key: z.string(),
      en: z.string().optional(),
      ar: z.string().optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") throw new Error("Unauthorized");
      
      const existing = await ctx.db.query.translations.findFirst({
        where: (t, { eq }) => eq(t.key, input.key)
      });

      if (existing) {
        return await ctx.db.update(translations)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(translations.id, existing.id));
      } else {
        return await ctx.db.insert(translations).values(input);
      }
    }),

  updateAdminPassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().optional(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("User not found");
      }

      // If user already has a password, verify it
      if (user.hashedPassword) {
        if (!input.currentPassword) {
          throw new Error("Current password is required");
        }
        const bcrypt = (await import("bcryptjs")).default;
        if (!bcrypt.compareSync(input.currentPassword, user.hashedPassword)) {
          throw new Error("Incorrect current password");
        }
      }

      const bcrypt = (await import("bcryptjs")).default;
      const hashedPassword = bcrypt.hashSync(input.newPassword, 10);
      
      await ctx.db.update(users)
        .set({ hashedPassword })
        .where(eq(users.id, ctx.session.user.id));
        
      return { success: true };
    }),

  createAdmin: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        phone: z.string().min(1),
        password: z.string().min(6),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      // Check for existing user with same phone or email
      const existingByPhone = await ctx.db.query.users.findFirst({
        where: eq(users.phone, input.phone),
      });
      if (existingByPhone) {
        throw new Error("A user with this phone number already exists");
      }

      const existingByEmail = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (existingByEmail) {
        throw new Error("A user with this email already exists");
      }

      const bcrypt = (await import("bcryptjs")).default;
      const hashedPassword = bcrypt.hashSync(input.password, 10);
      
      return await ctx.db.insert(users).values({
        email: input.email,
        phone: input.phone,
        hashedPassword,
        name: input.name,
        role: "ADMIN",
      });
    }),
});
