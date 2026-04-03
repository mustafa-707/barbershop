import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { bookings } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const bookingRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      guestName: z.string().optional(),
      guestPhone: z.string().optional(),
      bookingTime: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      const newBookings = await ctx.db.insert(bookings).values({
        guestName: input.guestName,
        guestPhone: input.guestPhone,
        bookingTime: input.bookingTime,
        userId: ctx.session?.user?.id,
        status: "PENDING",
      }).returning();
      
      return newBookings[0];
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.bookings.findMany({
      orderBy: [desc(bookings.bookingTime)],
    });
  }),
  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(bookings).set({ status: input.status }).where(eq(bookings.id, input.id));
      return { success: true };
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(bookings).where(eq(bookings.id, input.id));
      return { success: true };
    }),
});
