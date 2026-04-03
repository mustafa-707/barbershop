import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { bookings, orders } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Calendar, Package, Mail } from "lucide-react";
import { format } from "date-fns";
import { ProfileEditForm } from "~/components/profile-edit-form";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const session = await auth();
  const shopT = await getTranslations('Shop');

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const user = session.user;

  const userBookings = await db.query.bookings.findMany({
    where: eq(bookings.userId, user.id),
    orderBy: [desc(bookings.bookingTime)],
    limit: 5,
  });

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    orderBy: [desc(orders.createdAt)],
    limit: 5,
    with: {
        items: {
            with: {
                product: true
            }
        }
    }
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20 space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-10 glass-dark p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-3xl">
        <Avatar className="h-40 w-40 border-8 border-white/10 shadow-3xl">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
          <AvatarFallback className="text-4xl font-black bg-primary text-black">{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-8 text-center md:text-left">
          {/* Static Name/Phone removed to fix duplication as per User feedback */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {user.email && (
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 shadow-sm backdrop-blur-md">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-white/80">{user.email}</span>
              </div>
            )}
            {user.role && (
                <div className="px-6 py-3 bg-primary/20 text-primary rounded-full text-xs font-black tracking-[0.2em] uppercase border border-primary/20 shadow-xl">
                    {user.role}
                </div>
            )}
          </div>
          <ProfileEditForm user={{ name: user.name, phone: (user as {phone?: string}).phone ?? null }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="space-y-6">
          <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter uppercase">
            <Calendar className="h-10 w-10 text-primary" />
            {shopT('recentBookings')}
          </h2>
          <div className="space-y-4">
            {userBookings.length > 0 ? (
              userBookings.map((booking) => (
                <Card key={booking.id} className="glass dark:glass-dark border-white/10 rounded-3xl overflow-hidden glass-card">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-black text-xl text-white">{format(booking.bookingTime, "PPP")}</p>
                      <p className="text-white/50 font-bold">{format(booking.bookingTime, "p")}</p>
                    </div>
                    <div className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                      {booking.status}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground font-bold p-8 glass rounded-3xl border border-white/5 text-center">No bookings found.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-6">
          <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter uppercase">
            <Package className="h-10 w-10 text-primary" />
            {shopT('recentOrders')}
          </h2>
          <div className="space-y-4">
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <Card key={order.id} className="glass dark:glass-dark border-white/10 rounded-3xl overflow-hidden glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-black text-xl">{format(order.createdAt, "MMM d, yyyy")}</p>
                        <div className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                            {order.status}
                        </div>
                    </div>
                    <div className="space-y-2">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm font-bold opacity-80">
                                <span>{item.product.nameEn} x {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground font-bold p-8 glass rounded-3xl border border-white/5 text-center">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
