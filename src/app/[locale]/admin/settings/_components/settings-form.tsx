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
import { useTranslations, useLocale } from "next-intl"
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
  heroImageUrl: z.string().optional().nullable(),
  aboutImageUrl: z.string().optional().nullable(),
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  backgroundColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  radius: z.string().optional().nullable(),
  fontFamily: z.string().optional().nullable(),
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
  heroImageUrl?: string | null;
  aboutImageUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  radius?: string | null;
  fontFamily?: string | null;
} | null }) {
  const router = useRouter()
  const t = useTranslations('Admin')
  const common = useTranslations('Common')
  const locale = useLocale()
  
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
      heroImageUrl: initialData?.heroImageUrl ?? "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop",
      aboutImageUrl: initialData?.aboutImageUrl ?? "",
      primaryColor: initialData?.primaryColor ?? "#C5A059",
      secondaryColor: initialData?.secondaryColor ?? "#1e293b",
      backgroundColor: initialData?.backgroundColor ?? "#020617",
      textColor: initialData?.textColor ?? "#f8fafc",
      radius: initialData?.radius ?? "2.5rem",
      fontFamily: initialData?.fontFamily ?? "Inter",
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
                    <FormLabel className="font-bold">{t('openingHoursEn')}</FormLabel>
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
                    <FormLabel className="font-bold">{t('openingHoursAr')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="الإثنين-السبت: ١٠ص - ٩م | الأحد: مغلق" className="h-14 rounded-xl bg-background/50 border-white/10 text-lg text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Style & Theme Settings */}
          <div className="space-y-8 glass dark:glass-dark p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <div className="w-6 h-6 rounded-full bg-primary" />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tight">{t('themeMedia')}</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="heroImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('heroBackground')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="aboutImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('aboutImage')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('primaryColor')}</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg font-mono" />
                          <div className="w-14 h-14 rounded-xl border border-white/10" style={{ backgroundColor: field.value ?? '#C5A059' }} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('secondaryColor')}</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg font-mono" />
                          <div className="w-14 h-14 rounded-xl border border-white/10" style={{ backgroundColor: field.value ?? '#1e293b' }} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('backgroundColor')}</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg font-mono" />
                          <div className="w-14 h-14 rounded-xl border border-white/10" style={{ backgroundColor: field.value ?? '#020617' }} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('textColor')}</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg font-mono" />
                          <div className="w-14 h-14 rounded-xl border border-white/10" style={{ backgroundColor: field.value ?? '#f8fafc' }} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('cornerRadius')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="2.5rem" className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-foreground/40">{t('fontFamily')}</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          value={field.value ?? "Inter"} 
                          className="w-full h-14 rounded-xl bg-background/50 border-white/10 text-lg px-4 appearance-none focus:outline-none"
                        >
                          <option value="Inter">Inter (Modern)</option>
                          <option value="Outfit">Outfit (Clean)</option>
                          <option value="Playfair Display">Playfair Display (Luxury)</option>
                          <option value="Roboto">Roboto (Technical)</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
               <FormField
                control={form.control}
                name="faviconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('faviconUrl')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} className="h-14 rounded-xl bg-background/50 border-white/10 text-lg" />
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
            </div>
          </div>
          
          
          
          
          <div className="lg:col-span-2 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/${locale}/admin/settings/translations`)}
              className="h-16 px-12 rounded-2xl border-white/10 text-lg font-bold uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center gap-4"
            >
              <Globe className="h-6 w-6" />
              {t('manageTranslations')}
            </Button>
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
