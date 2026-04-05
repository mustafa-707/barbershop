"use client"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { api } from "~/trpc/react"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function CreateAdminForm() {
  const t = useTranslations('Admin')
  const common = useTranslations('Common')

  const form = useForm<z.infer<typeof createAdminSchema>>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const createAdmin = api.settings.createAdmin.useMutation({
    onSuccess: () => {
      toast.success(t('adminCreatedSuccess'))
      form.reset()
    },
    onError: (e) => {
      toast.error(e.message)
    }
  });

  function onSubmit(values: z.infer<typeof createAdminSchema>) {
    createAdmin.mutate(values);
  }

  return (
    <div className="space-y-8 glass dark:glass-dark p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4 mb-2">
         <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <UserPlus className="h-6 w-6" />
         </div>
         <h2 className="text-2xl font-black uppercase tracking-tight">{t('createAdmin')}</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t('adminName')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('adminName')} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t('adminPhone')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+962 7 XXXX XXXX" className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t('adminEmail')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="admin@example.com" className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t('initialPassword')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
             <Button
                type="submit"
                disabled={createAdmin.isPending}
                className="h-14 px-8 rounded-2xl disabled:opacity-50"
             >
                {createAdmin.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {t('createAdminAccount')}
             </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
