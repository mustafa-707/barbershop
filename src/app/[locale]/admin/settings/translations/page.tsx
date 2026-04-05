"use client"
import * as React from "react"
import { api } from "~/trpc/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Save, Loader2, Plus, Search, Globe } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export default function TranslationsPage() {
  const t = useTranslations('Admin')
  const common = useTranslations('Common')
  const [search, setSearch] = React.useState("")
  const [newKey, setNewKey] = React.useState("")
  
  const { data: translations, refetch } = api.settings.getTranslations.useQuery()
  const upsert = api.settings.upsertTranslation.useMutation({
    onSuccess: () => {
      toast.success(common('save'))
      refetch()
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })

  const filtered = translations?.filter(tr => 
    tr.key.toLowerCase().includes(search.toLowerCase()) ||
    (tr.en || "").toLowerCase().includes(search.toLowerCase()) ||
    (tr.ar || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (key: string, en: string, ar: string) => {
    upsert.mutate({ key, en, ar })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tight">{t('manageTranslations')}</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.3em]">
             {t('settingsDesc')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-background p-4 border border-white/5 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={common('search')} 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-background border-white/10"
          />
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-foreground/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent h-16">
              <TableHead className="w-[30%] font-bold uppercase text-[10px] tracking-widest px-8">Key (Namespace.Key)</TableHead>
              <TableHead className="w-[30%] font-bold uppercase text-[10px] tracking-widest">English</TableHead>
              <TableHead className="w-[30%] font-bold uppercase text-[10px] tracking-widest text-right px-8">Arabic</TableHead>
              <TableHead className="w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* New Entry Row */}
            <TableRow className="border-white/5 bg-primary/5 h-20">
              <TableCell className="px-8">
                <Input 
                  placeholder="e.g. Nav.about" 
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  className="h-10 rounded-lg bg-background border-white/10 text-xs font-mono"
                />
              </TableCell>
              <TableCell colSpan={2} className="text-center italic text-muted-foreground text-xs">
                {t('createAdmin')} - {common('confirm')}
              </TableCell>
              <TableCell className="pr-8">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => { if(newKey) { handleSave(newKey, "", ""); setNewKey("") } }}
                   className="hover:bg-primary/20 h-10 w-10 rounded-xl"
                 >
                   <Plus className="h-5 w-5" />
                 </Button>
              </TableCell>
            </TableRow>

            {filtered?.map((tr) => (
              <TranslationRow key={tr.id} tr={tr} onSave={handleSave} common={common} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function TranslationRow({ tr, onSave, common }: { tr: any, onSave: (key: string, en: string, ar: string) => void, common: any }) {
  const [en, setEn] = React.useState(tr.en || "")
  const [ar, setAr] = React.useState(tr.ar || "")
  const hasChanged = en !== (tr.en || "") || ar !== (tr.ar || "")

  return (
    <TableRow className="border-white/5 hover:bg-white/5 transition-colors group h-20">
      <TableCell className="px-8 font-mono text-xs text-primary/60">{tr.key}</TableCell>
      <TableCell>
        <Input 
          value={en} 
          onChange={e => setEn(e.target.value)}
          className="h-10 rounded-lg bg-background/50 border-white/10 text-xs"
        />
      </TableCell>
      <TableCell className="px-8">
        <Input 
          value={ar} 
          onChange={e => setAr(e.target.value)}
          className="h-10 rounded-lg bg-background/50 border-white/10 text-xs text-right"
          dir="rtl"
        />
      </TableCell>
      <TableCell className="pr-8">
        <Button 
          size="icon"
          variant={hasChanged ? "default" : "ghost"}
          disabled={!hasChanged}
          onClick={() => onSave(tr.key, en, ar)}
          className={hasChanged ? "bg-primary text-primary-foreground h-10 w-10 rounded-xl" : "opacity-0 group-hover:opacity-100 h-10 w-10 rounded-xl"}
        >
          <Save className="h-5 w-5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
