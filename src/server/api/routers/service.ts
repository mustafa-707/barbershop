import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { services } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const serviceRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.services.findMany({
      orderBy: (services, { asc }) => [asc(services.nameEn)],
    });
  }),

  create: publicProcedure
    .input(z.object({
      nameEn: z.string().min(1),
      nameAr: z.string().min(1),
      descriptionEn: z.string().optional(),
      descriptionAr: z.string().optional(),
      price: z.string().min(1),
      duration: z.number().default(30),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(services).values(input).returning();
      return result[0];
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      nameEn: z.string().min(1),
      nameAr: z.string().min(1),
      descriptionEn: z.string().optional(),
      descriptionAr: z.string().optional(),
      price: z.string().min(1),
      duration: z.number().default(30),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await ctx.db.update(services).set(data).where(eq(services.id, id)).returning();
      return result[0];
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(services).where(eq(services.id, input.id));
      return { success: true };
    }),
});
