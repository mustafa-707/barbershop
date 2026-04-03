import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { settings } from "~/server/db/schema";
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
        contactPhone: z.string().optional().nullable(),
        contactEmail: z.string().email().optional().nullable().or(z.literal("")),
        mapUrl: z.string().optional().nullable(),
        descriptionEn: z.string().optional().nullable(),
        descriptionAr: z.string().optional().nullable(),
        logoUrl: z.string().optional().nullable(),
        faviconUrl: z.string().optional().nullable(),
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
});
