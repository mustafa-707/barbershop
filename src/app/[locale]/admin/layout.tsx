import { auth } from "~/server/auth";
import { Link } from "~/i18n/routing";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingCart,
  Settings,
  Users
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const user = session.user;

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const navItems = [
    { title: "Overview", href: "/admin", icon: LayoutDashboard },
    { title: "Products", href: "/admin/products", icon: Package },
    { title: "Bookings", href: "/admin/bookings", icon: Calendar },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
        </div>
        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
