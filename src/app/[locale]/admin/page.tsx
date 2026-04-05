import { db } from "~/server/db";
import { products, bookings, orders, users } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import {
  ShoppingBag,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Settings,
  Activity
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "~/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations('Admin');

  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [bookingCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings);
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

  const stats = [
    {
      title: t('totalProducts'),
      value: productCount?.count ?? 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      href: "/admin/products",
    },
    {
      title: t('activeBookings'),
      value: bookingCount?.count ?? 0,
      icon: Calendar,
      color: "text-green-600",
      href: "/admin/bookings",
    },
    {
      title: t('totalOrders'),
      value: orderCount?.count ?? 0,
      icon: TrendingUp,
      color: "text-purple-600",
      href: "/admin/orders",
    },
    {
      title: t('customers'),
      value: userCount?.count ?? 0,
      icon: Users,
      color: "text-orange-600",
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
        <p className="text-muted-foreground">{t('welcome')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="glass dark:glass-dark transition-all hover:scale-[1.02] cursor-pointer border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl" asChild>
              <Link href="/admin/products/new">
                <Plus className="h-6 w-6" />
                <span>{t('newProduct')}</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl" asChild>
              <Link href="/admin/settings">
                <Settings className="h-6 w-6" />
                <span>{t('shopSettings')}</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="glass dark:glass-dark p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4">{t('siteActivity')}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground py-4">
            <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
            <div>
              <p className="font-medium text-foreground">{t('systemOnline')}</p>
              <p>{t('allServicesRunning')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
