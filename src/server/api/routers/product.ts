import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { products } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const productRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
      limit: 10,
    });
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        where: (products, { eq }) => eq(products.id, input.id),
      });
    }),
  create: publicProcedure
    .input(z.object({
      nameEn: z.string().min(1),
      nameAr: z.string().min(1),
      descriptionEn: z.string().optional(),
      descriptionAr: z.string().optional(),
      imageUrl: z.string().optional(),
      price: z.string().default("5 JOD"),
      quantity: z.number().default(0),
      isNewProd: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const [newProduct] = await ctx.db.insert(products).values(input as typeof products.$inferInsert).returning();
      return newProduct;
    }),
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      nameEn: z.string().min(1),
      nameAr: z.string().min(1),
      descriptionEn: z.string().optional(),
      descriptionAr: z.string().optional(),
      imageUrl: z.string().optional(),
      price: z.string().optional(),
      quantity: z.number().optional(),
      isNewProd: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updatedProduct] = await ctx.db.update(products).set(data as Partial<typeof products.$inferInsert>).where(eq(products.id, id)).returning();
      return updatedProduct;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
