import type { ReactNode } from "react";
import { 
  LayoutDashboard, 
  Scissors, 
  User, 
  Package, 
  Calendar, 
  ShoppingCart, 
  Settings, 
  Users,
  LogOut,
  ChevronRight,
  Menu
} from "lucide-react";
import { Link } from "~/i18n/routing";
import { Button } from "~/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "~/components/ui/sheet";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({ 
  children,
  params
}: { 
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations('Admin');
  const nav = await getTranslations('Nav');

  if (session?.user?.role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  const navItems = [
    { title: t('dashboard'), href: "/admin", icon: LayoutDashboard },
    { title: t('servicesTitle'), href: "/admin/services", icon: Scissors },
    { title: t('barbersTitle'), href: "/admin/barbers", icon: User },
    { title: t('productsTitle'), href: "/admin/products", icon: Package },
    { title: t('bookingsTitle'), href: "/admin/bookings", icon: Calendar },
    { title: t('ordersTitle'), href: "/admin/orders", icon: ShoppingCart },
    { title: t('usersTitle'), href: "/admin/users", icon: Users },
    { title: t('settingsTitle'), href: "/admin/settings", icon: Settings },
  ];

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-slate-950 text-slate-200 border-r border-white/5">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <Scissors className="h-6 w-6" />
          </div>
          <span className="text-xl font-black uppercase tracking-tight text-white">{t('admin')}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all hover:bg-white/5 hover:text-primary group"
          >
            <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-4 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary border border-white/10">
            {session.user.name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{session.user.name}</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">{session.user.role}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-4 justify-start gap-4 h-12 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 font-bold uppercase tracking-widest text-xs"
          asChild
        >
          <Link href="/api/auth/signout">
             <LogOut className="h-4 w-4" />
             {nav('logout')}
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="w-14 h-14 rounded-2xl bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-white/5 bg-slate-950">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-6 lg:p-12 max-w-7xl mx-auto pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
