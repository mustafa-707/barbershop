"use client"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { LogOut, User, LayoutDashboard } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Link } from "~/i18n/routing"
import { useTranslations } from 'next-intl'
import { motion } from "framer-motion"

export function UserNav() {
  const t = useTranslations('Nav')
  const { data: session } = useSession()

  if (!session) {
    return (
      <Button asChild variant="ghost" className="rounded-full px-6 h-11 bg-white/5 hover:bg-white/10 border border-white/10">
        <Link href="/login">
          <User className="mr-2 h-4 w-4" />
          {t('login')}
        </Link>
      </Button>
    )
  }

  const user = session.user


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 border border-white/10 shadow-lg">
            <Avatar className="h-11 w-11 border-2 border-white/10 shadow-inner">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name ?? ""} />
              <AvatarFallback className="bg-primary/10 text-primary">{user.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass dark:glass-dark w-64 p-2 rounded-2xl border border-white/10" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-bold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuGroup className="p-1">
            <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer">
              <Link href="/profile" className="w-full flex items-center">
                <User className="mr-3 h-4 w-4 text-primary" />
                <span className="font-bold uppercase tracking-widest text-xs">{t('profile')}</span>
              </Link>
            </DropdownMenuItem>
            {session.user.role === 'ADMIN' && (
              <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer">
                <Link href="/admin" className="w-full flex items-center">
                  <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                  <span className="font-bold uppercase tracking-widest text-xs">Admin Panel</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={() => signOut()} className="focus:bg-destructive/10 focus:text-destructive rounded-xl cursor-pointer">
            <LogOut className="mr-3 h-4 w-4 text-primary" />
            <span className="font-bold uppercase tracking-widest text-xs">{t('logout')}</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
