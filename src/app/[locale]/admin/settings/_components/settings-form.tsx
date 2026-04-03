"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
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
import { Textarea } from "~/components/ui/textarea"
import { api } from "~/trpc/react"
import { useTranslations } from "next-intl"
import { Save, Loader2, Globe, Phone, Mail, Map } from "lucide-react"
import { toast } from "sonner"

const settingsSchema = z.object({
  siteNameEn: z.string().min(1),
  siteNameAr: z.string().min(1),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable().or(z.literal("")),
  mapUrl: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  openingHoursEn: z.string().optional().nullable(),
  openingHoursAr: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
})

export function SettingsForm({ initialData }: { initialData?: {
  id?: string;
  siteNameEn: string | null;
  siteNameAr: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  mapUrl?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  openingHoursEn?: string | null;
  openingHoursAr?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
} | null }) {
  const router = useRouter()
  const t = useTranslations('Admin')
  const common = useTranslations('Common')
  
  const updateSettings = api.settings.update.useMutation({
    onSuccess: () => {
      toast.success(t('settingsUpdated'))
      router.refresh()
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteNameEn: initialData?.siteNameEn ?? "BarberShop",
      siteNameAr: initialData?.siteNameAr ?? "صالون الحلاقة",
      contactPhone: initialData?.contactPhone ?? "",
      contactEmail: initialData?.contactEmail ?? "",
      mapUrl: initialData?.mapUrl ?? "",
      descriptionEn: initialData?.descriptionEn ?? "",
      descriptionAr: initialData?.descriptionAr ?? "",
      openingHoursEn: initialData?.openingHoursEn ?? "",
      openingHoursAr: initialData?.openingHoursAr ?? "",
      logoUrl: initialData?.logoUrl ?? "",
      faviconUrl: initialData?.faviconUrl ?? "",
    },
  })

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    updateSettings.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Brand Settings */}
          <div className="space-y-8 glass dark:glass-dark p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Globe className="h-6 w-6" />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tight">{t('brandSettings')}</h2>
            </div>
            
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="siteNameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('siteNameEn')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siteNameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('siteNameAr')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('descriptionEn')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value ?? ""} className="min-h-[120px] rounded-xl bg-background/50 border-white/10 text-lg resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('descriptionAr')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value ?? ""} className="min-h-[120px] rounded-xl bg-background/50 border-white/10 text-lg text-right resize-none" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openingHoursEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Opening Hours (English)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Mon-Sat: 10AM - 9PM | Sun: Closed" className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openingHoursAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Opening Hours (Arabic)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="الإثنين-السبت: ١٠ص - ٩م | الأحد: مغلق" className="h-14 rounded-xl bg-background/50 border-white/10 text-lg text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact & Links Settings */}
          <div className="space-y-8 glass dark:glass-dark p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Phone className="h-6 w-6" />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tight">{t('contactSettings')}</h2>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('contactPhone')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input {...field} value={field.value ?? ""} className="pl-12 h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('contactEmail')}</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input {...field} value={field.value ?? ""} className="pl-12 h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('mapUrl')}</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Map className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input {...field} value={field.value ?? ""} placeholder="Google Maps Embed URL" className="pl-12 h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('logoUrl')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button 
            type="submit" 
            disabled={updateSettings.isPending}
            className="h-16 px-12 rounded-2xl btn-premium text-white text-xl font-bold shadow-2xl flex items-center gap-3"
          >
            {updateSettings.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Save className="h-6 w-6" />
            )}
            {common('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
