import { db } from "~/server/db";
import { bookings } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table";
import { Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookingActions } from "./_components/booking-actions";

export default async function AdminBookingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Admin');
  const common = await getTranslations('Common');
  
  const allBookings = await db.query.bookings.findMany({
    orderBy: [desc(bookings.createdAt)],
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between bg-white/5 dark:bg-black/20 p-8 rounded-[2rem] border border-white/10 glass shadow-xl">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t('bookingsTitle')}</h1>
          <p className="text-muted-foreground text-lg">{t('bookingsDesc')}</p>
        </div>
      </div>

      <div className="border border-white/10 rounded-[2rem] bg-background/50 overflow-hidden shadow-2xl glass">
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
            {allBookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-white/5 border-white/5 h-20 transition-colors">
                <TableCell className="px-8 font-bold">{booking.guestName}</TableCell>
                <TableCell className="font-medium text-muted-foreground">{booking.guestPhone}</TableCell>
                <TableCell className="font-medium">
                  {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(booking.bookingTime)}
                </TableCell>
                <TableCell>
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500 shadow-sm">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {t(`statusMap.${booking.status}` as any) || booking.status}
                  </span>
                </TableCell>
                <TableCell className="text-end px-8">
                  <BookingActions id={booking.id} status={booking.status} />
                </TableCell>
              </TableRow>
            ))}
            {allBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24 text-muted-foreground space-y-4">
                   <Calendar className="h-16 w-16 mx-auto opacity-10" />
                   <p className="text-xl font-bold">{t('noBookings')}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
