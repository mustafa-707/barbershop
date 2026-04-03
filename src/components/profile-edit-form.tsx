"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { api } from "~/trpc/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Edit2, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileEditFormProps {
  user: {
    name?: string | null;
    phone?: string | null;
  }
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const common = useTranslations('Common')
  const [isEditing, setIsEditing] = React.useState(false)
  const [name, setName] = React.useState(user.name ?? "")
  const [phone, setPhone] = React.useState(user.phone ?? "")
  const router = useRouter()

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false)
      router.refresh()
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate({ name, phone })
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-1">
               <h1 className="text-5xl font-black tracking-tight">{user.name}</h1>
               <div className="text-xl text-muted-foreground font-bold opacity-60">{user.phone ?? "No phone set"}</div>
            </div>
            <Button 
                variant="outline" 
                className="w-fit rounded-full px-8 py-6 h-auto text-lg font-black border-white/10 glass hover:bg-white/10"
                onClick={() => setIsEditing(true)}
            >
                <Edit2 className="w-5 h-5 mr-3" />
                {common('edit')}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-8 glass dark:glass-dark p-10 rounded-[2.5rem] border border-white/10"
          >
            <div className="grid gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-black uppercase tracking-widest opacity-50 pl-2">Full Name</Label>
                <Input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="h-14 rounded-2xl bg-white/5 border-white/10 text-lg px-6 font-bold" 
                    placeholder="Enter your name"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-black uppercase tracking-widest opacity-50 pl-2">Phone Number</Label>
                <Input 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="h-14 rounded-2xl bg-white/5 border-white/10 text-lg px-6 font-bold" 
                    placeholder="+962 7..."
                />
              </div>
            </div>
            <div className="flex gap-4">
               <Button 
                    type="submit" 
                    className="flex-1 h-14 rounded-2xl btn-premium text-white font-black uppercase tracking-widest shadow-xl"
                    disabled={updateProfile.isPending}
               >
                  <Save className="w-5 h-5 mr-3" />
                  {updateProfile.isPending ? common('submitting') : common('save')}
               </Button>
               <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-14 rounded-2xl px-8 font-bold border border-white/5"
                    onClick={() => setIsEditing(false)}
               >
                  <X className="w-5 h-5 mr-3" />
                  {common('cancel')}
               </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
