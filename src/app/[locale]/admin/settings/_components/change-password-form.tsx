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
import { Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

const passwordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function ChangePasswordForm() {
  const t = useTranslations('Admin')

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updatePassword = api.settings.updateAdminPassword.useMutation({
    onSuccess: () => {
      toast.success(t('passwordUpdated'))
      form.reset()
    },
    onError: (e) => {
      toast.error(e.message)
    }
  });

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    updatePassword.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  }

  return (
    <div className="space-y-8 glass dark:glass-dark p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4 mb-2">
         <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Shield className="h-6 w-6" />
         </div>
         <h2 className="text-2xl font-black uppercase tracking-tight">{t('adminSecurity')}</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t('currentPassword')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t('newPassword')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t('confirmPassword')}</FormLabel>
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
                disabled={updatePassword.isPending}
                className="h-14 px-8 rounded-2xl disabled:opacity-50"
             >
                {updatePassword.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {t('changePassword')}
             </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
