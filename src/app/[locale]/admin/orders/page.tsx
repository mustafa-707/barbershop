import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table";
import { ShoppingBag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { OrderActions } from "./_components/order-actions";

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Admin');
  const common = await getTranslations('Common');
  
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between bg-white/5 dark:bg-black/20 p-8 rounded-[2rem] border border-white/10 glass shadow-xl">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('ordersTitle')}</h1>
          <p className="text-muted-foreground text-lg">{t('ordersDesc')}</p>
        </div>
      </div>

      <div className="border border-white/10 rounded-[2rem] bg-background/50 overflow-x-auto shadow-2xl glass">
        <Table>
          <TableHeader className="bg-white/5 text-xs uppercase tracking-widest font-black">
            <TableRow className="hover:bg-transparent border-white/10 h-16">
              <TableHead className="px-8">{t('fullName')}</TableHead>
              <TableHead>{t('phone')}</TableHead>
              <TableHead>{t('date')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right px-8">{common('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-white/5 border-white/5 h-20 transition-colors">
                <TableCell className="px-8 font-bold">{order.guestName}</TableCell>
                <TableCell className="font-medium text-muted-foreground">{order.guestPhone}</TableCell>
                <TableCell className="font-medium">
                  {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(order.createdAt)}
                </TableCell>
                <TableCell>
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-500 shadow-sm border border-blue-500/10">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {t(`statusMap.${order.status}` as any) || order.status}
                  </span>
                </TableCell>
                <TableCell className="text-end px-8">
                  <OrderActions id={order.id} status={order.status} />
                </TableCell>
              </TableRow>
            ))}
            {allOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24 text-muted-foreground space-y-4">
                   <ShoppingBag className="h-16 w-16 mx-auto opacity-10" />
                   <p className="text-xl font-bold">{t('noOrders')}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
