import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { barbers } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const barberRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.barbers.findMany({
      orderBy: (barbers, { asc }) => [asc(barbers.nameEn)],
    });
  }),

  create: publicProcedure
    .input(z.object({
      nameEn: z.string().min(1),
      nameAr: z.string().min(1),
      imageUrl: z.string().optional(),
      descriptionEn: z.string().optional(),
      descriptionAr: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(barbers).values(input).returning();
      return result[0];
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      nameEn: z.string().min(1),
      nameAr: z.string().min(1),
      imageUrl: z.string().optional(),
      descriptionEn: z.string().optional(),
      descriptionAr: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await ctx.db.update(barbers).set(data).where(eq(barbers.id, id)).returning();
      return result[0];
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(barbers).where(eq(barbers.id, input.id));
      return { success: true };
    }),
});
