"use client"
import * as React from "react"
import { api } from "~/trpc/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Plus, Trash2, Save, Loader2, Scissors, Search } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"

export default function ServicesPage() {
  const t = useTranslations('Admin')
  const common = useTranslations('Common')
  const [search, setSearch] = React.useState("")
  const [isAdding, setIsAdding] = React.useState(false)
  
  const { data: services, refetch } = api.service.getAll.useQuery()
  const create = api.service.create.useMutation({ 
    onSuccess: () => { 
      void refetch(); 
      toast.success(t('serviceAddedSuccess'));
      setIsAdding(false);
      setNewItem({ nameEn: "", nameAr: "", price: "", duration: 30 });
    } 
  })
  const update = api.service.update.useMutation({ onSuccess: () => { void refetch(); toast.success(t('serviceUpdatedSuccess')) } })
  const remove = api.service.delete.useMutation({ onSuccess: () => { void refetch(); toast.success(t('serviceDeletedSuccess')) } })

  const [newItem, setNewItem] = React.useState({ nameEn: "", nameAr: "", price: "", duration: 30 })

  const filtered = services?.filter(s => 
    s.nameEn.toLowerCase().includes(search.toLowerCase()) || 
    s.nameAr.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 dark:bg-black/20 p-8 rounded-[2rem] border border-white/10 glass shadow-xl">
         <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase tracking-tight">{t('servicesTitle')}</h1>
            <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.3em]">{t('servicesDesc')}</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder={common('search')} 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="pl-12 h-12 rounded-xl bg-background/50 border-white/10"
               />
            </div>
            <Button 
               onClick={() => setIsAdding(!isAdding)}
               className={`h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${isAdding ? 'bg-red-500/10 text-red-500' : 'bg-primary text-primary-foreground'}`}
            >
               {isAdding ? common('cancel') : (
                 <>
                   <Plus className="h-4 w-4 mr-2" />
                   {t('addService')}
                 </>
               )}
            </Button>
         </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-2xl mb-10 overflow-hidden">
               <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">{t('addService')}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('siteNameEn')}</label>
                       <Input 
                         placeholder="e.g. Haircut & Styling" 
                         value={newItem.nameEn} 
                         onChange={e => setNewItem({...newItem, nameEn: e.target.value})}
                         className="bg-background/50 border-white/10 h-14 rounded-xl px-6 text-lg"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mr-4 block text-right">{t('siteNameAr')}</label>
                       <Input 
                         placeholder="مثلاً: قص شعر وتصفيف" 
                         value={newItem.nameAr} 
                         onChange={e => setNewItem({...newItem, nameAr: e.target.value})}
                         className="bg-background/50 border-white/10 h-14 rounded-xl px-6 text-lg text-right"
                         dir="rtl"
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('price')}</label>
                       <Input 
                         placeholder="10 JOD" 
                         value={newItem.price} 
                         onChange={e => setNewItem({...newItem, price: e.target.value})}
                         className="bg-background/50 border-white/10 h-14 rounded-xl px-6 font-mono"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{common('duration')} ({common('minutes')})</label>
                       <Input 
                         type="number" 
                         value={newItem.duration} 
                         onChange={e => setNewItem({...newItem, duration: parseInt(e.target.value)})}
                         className="bg-background/50 border-white/10 h-14 rounded-xl px-6"
                       />
                    </div>
                    <div className="flex items-end">
                       <Button 
                         onClick={() => create.mutate(newItem)}
                         className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[12px] shadow-xl"
                         disabled={!newItem.nameEn || !newItem.price || create.isPending}
                       >
                         {create.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : common('save')}
                       </Button>
                    </div>
                 </div>
               </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered?.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onUpdate={update.mutate} 
            isUpdating={update.isPending}
            onDelete={remove.mutate} 
            t={t}
            common={common}
          />
        ))}
        {filtered?.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-4 opacity-20">
             <Scissors className="h-20 w-20 mx-auto" />
             <p className="text-xl font-bold uppercase tracking-widest">{t('noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ServiceCard({ service, onUpdate, isUpdating, onDelete, t, common }: { service: any; onUpdate: any; isUpdating: boolean; onDelete: any; t: any; common: any }) {
  const [data, setData] = React.useState(service)
  const hasChanged = JSON.stringify({ nameEn: data.nameEn, nameAr: data.nameAr, price: data.price, duration: data.duration }) !== 
                     JSON.stringify({ nameEn: service.nameEn, nameAr: service.nameAr, price: service.price, duration: service.duration })

  return (
    <Card className="rounded-[2.5rem] border-white/10 glass dark:glass-dark overflow-hidden transition-all hover:border-primary/40 group shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
         <div className="p-3 bg-primary/10 rounded-2xl text-primary transition-transform group-hover:scale-110">
            <Scissors className="h-6 w-6" />
         </div>
         <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => { if(confirm(t('deleteConfirm'))) onDelete({ id: service.id }) }} 
           className="text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl h-10 w-10"
         >
            <Trash2 className="h-5 w-5" />
         </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <Input 
            value={data.nameEn} 
            onChange={e => setData({...data, nameEn: e.target.value})}
            className="bg-foreground/[0.03] border-none h-12 rounded-xl px-4 font-black uppercase tracking-tight"
          />
          <Input 
            value={data.nameAr} 
            onChange={e => setData({...data, nameAr: e.target.value})}
            className="bg-foreground/[0.03] border-none h-12 rounded-xl px-4 text-right font-bold"
            dir="rtl"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-2">{t('price')}</label>
              <Input 
                value={data.price} 
                onChange={e => setData({...data, price: e.target.value})}
                className="bg-foreground/[0.03] border-none h-12 rounded-xl px-4 font-mono text-sm"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-2">{common('duration')}</label>
              <Input 
                type="number" 
                value={data.duration} 
                onChange={e => setData({...data, duration: parseInt(e.target.value)})}
                className="bg-foreground/[0.03] border-none h-12 rounded-xl px-4 text-sm"
              />
           </div>
        </div>
        <AnimatePresence>
          {hasChanged && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
               <Button 
                 onClick={() => onUpdate(data)} 
                 className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                 disabled={isUpdating}
               >
                 {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                   <>
                     <Save className="h-4 w-4 mr-2" />
                     {common('save')}
                   </>
                 )}
               </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
