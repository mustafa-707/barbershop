"use client"
import * as React from "react"
import { api } from "~/trpc/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Plus, Trash2, Save, User, Image as ImageIcon, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"

export default function BarbersPage() {
  const t = useTranslations('Admin')
  const common = useTranslations('Common')
  const [search, setSearch] = React.useState("")
  const [isAdding, setIsAdding] = React.useState(false)
  
  const { data: barbers, refetch } = api.barber.getAll.useQuery()
  const create = api.barber.create.useMutation({ 
    onSuccess: () => { 
      void refetch(); 
      toast.success(t('barberAddedSuccess'));
      setIsAdding(false);
      setNewItem({ nameEn: "", nameAr: "", imageUrl: "", descriptionEn: "", descriptionAr: "" });
    } 
  })
  const update = api.barber.update.useMutation({ onSuccess: () => { void refetch(); toast.success(t('barberUpdatedSuccess')) } })
  const remove = api.barber.delete.useMutation({ onSuccess: () => { void refetch(); toast.success(t('barberDeletedSuccess')) } })

  const [newItem, setNewItem] = React.useState({ nameEn: "", nameAr: "", imageUrl: "", descriptionEn: "", descriptionAr: "" })

  const filtered = barbers?.filter(b => 
    b.nameEn.toLowerCase().includes(search.toLowerCase()) || 
    b.nameAr.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 dark:bg-black/20 p-8 rounded-[2rem] border border-white/10 glass shadow-xl">
         <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase tracking-tight">{t('barbersTitle')}</h1>
            <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.3em]">{t('barbersDesc')}</p>
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
                   {t('addBarber')}
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
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">{t('addBarber')}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('siteNameEn')}</label>
                       <Input 
                         placeholder="e.g. John Doe" 
                         value={newItem.nameEn} 
                         onChange={e => setNewItem({...newItem, nameEn: e.target.value})}
                         className="bg-background/50 border-white/10 h-14 rounded-xl px-6 text-lg"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mr-4 block text-right">{t('siteNameAr')}</label>
                       <Input 
                         placeholder="مثلاً: جون دو" 
                         value={newItem.nameAr} 
                         onChange={e => setNewItem({...newItem, nameAr: e.target.value})}
                         className="bg-background/50 border-white/10 h-14 rounded-xl px-6 text-lg text-right"
                         dir="rtl"
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('logoUrl')}</label>
                       <Input 
                         placeholder="https://..." 
                         value={newItem.imageUrl} 
                         onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
                         className="bg-background/50 border-white/10 h-14 rounded-xl px-6 font-mono text-xs"
                       />
                    </div>
                    <div className="flex items-end">
                       <Button 
                         onClick={() => create.mutate(newItem)}
                         className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[12px] shadow-xl"
                         disabled={!newItem.nameEn || create.isPending}
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
        {filtered?.map(barber => (
          <BarberCard 
            key={barber.id} 
            barber={barber} 
            onUpdate={update.mutate} 
            isUpdating={update.isPending}
            onDelete={remove.mutate} 
            t={t}
            common={common}
          />
        ))}
         {filtered?.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-4 opacity-20">
             <User className="h-20 w-20 mx-auto" />
             <p className="text-xl font-bold uppercase tracking-widest">{t('noUsers')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarberCard({ barber, onUpdate, isUpdating, onDelete, t, common }: { barber: any; onUpdate: any; isUpdating: boolean; onDelete: any; t: any; common: any }) {
  const [data, setData] = React.useState(barber)
  const hasChanged = JSON.stringify({ nameEn: data.nameEn, nameAr: data.nameAr, imageUrl: data.imageUrl }) !== 
                     JSON.stringify({ nameEn: barber.nameEn, nameAr: barber.nameAr, imageUrl: barber.imageUrl })

  return (
    <Card className="rounded-[2.5rem] border-white/10 glass dark:glass-dark overflow-hidden transition-all hover:border-primary/40 group shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
         <div className="p-3 bg-primary/10 rounded-2xl text-primary transition-transform group-hover:scale-110">
            <User className="h-6 w-6" />
         </div>
         <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => { if(confirm(t('deleteConfirm'))) onDelete({ id: barber.id }) }} 
           className="text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl h-10 w-10"
         >
            <Trash2 className="h-5 w-5" />
         </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-foreground/5 border border-white/5 transition-transform group-hover:scale-[1.02]">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.nameEn} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-10">
               <User className="h-20 w-20" />
            </div>
          )}
        </div>
        
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

        <div className="relative">
           <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input 
             value={data.imageUrl || ""} 
             onChange={e => setData({...data, imageUrl: e.target.value})}
             placeholder={t('logoUrl')}
             className="bg-foreground/[0.03] border-none h-12 rounded-xl pl-12 pr-4 text-xs font-mono"
           />
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
