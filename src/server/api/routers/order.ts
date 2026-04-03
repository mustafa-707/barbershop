import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { orders, orderItems } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      guestName: z.string().optional(),
      guestPhone: z.string().optional(),
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })).min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Create the order
      const newOrders = await ctx.db.insert(orders).values({
        guestName: input.guestName,
        guestPhone: input.guestPhone,
        userId: ctx.session?.user?.id,
        status: "PENDING",
      }).returning();
      
      const order = newOrders[0];

      if (!order) {
        throw new Error("Failed to create order");
      }

      // 2. Insert order items
      const itemsToInsert = input.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      }));

      await ctx.db.insert(orderItems).values(itemsToInsert);

      return order;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
  }),
  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.enum(["PENDING", "PROCESSING", "READY", "COMPLETED", "CANCELLED"]) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
      return { success: true };
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(orders).where(eq(orders.id, input.id));
      return { success: true };
    }),
});
