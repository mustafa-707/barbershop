import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table";
import { Users as UsersIcon, Shield, User, Lock, UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CreateAdminForm } from "../settings/_components/create-admin-form";
import { ChangePasswordForm } from "../settings/_components/change-password-form";

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations('Admin');
  
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.name)],
  });

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between bg-white/5 dark:bg-black/20 p-8 rounded-[2rem] border border-white/10 glass shadow-xl">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t('userManagement')}</h1>
          <p className="text-muted-foreground text-lg">{t('userManagementDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* User Table - Left Side */}
        <div className="xl:col-span-2 space-y-6">
          <div className="border border-white/10 rounded-[2.5rem] bg-background/50 overflow-hidden shadow-2xl glass">
            <Table>
              <TableHeader className="bg-white/5 text-xs uppercase tracking-widest font-black">
                <TableRow className="hover:bg-transparent border-white/10 h-16">
                  <TableHead className="px-8">{t('user')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead className="text-right px-8">{t('status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-white/5 border-white/5 h-20 transition-colors">
                    <TableCell className="px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <span className="font-bold">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.role === "ADMIN" ? (
                          <Shield className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                        {t('active')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {allUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-24 text-muted-foreground space-y-4">
                       <UsersIcon className="h-16 w-16 mx-auto opacity-10" />
                       <p className="text-xl font-bold">{t('noUsers')}</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Security & Admin Creation - Right Side */}
        <div className="space-y-10">
          <CreateAdminForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
