"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        phone,
        name: name || undefined,
        password: password || undefined,
        redirect: false,
      })

      if (res?.error) {
        setError(res.error)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <div className="space-y-2 text-left" dir="ltr">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Phone / Email</Label>
          <Input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+962 7... or admin@example.com"
            className="h-14 bg-foreground/[0.03] border-transparent font-medium"
            dir="ltr"
          />
        </div>
        <div className="space-y-2 text-left" dir="ltr">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Name (For new accounts only)</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="h-14 bg-foreground/[0.03] border-transparent font-medium"
          />
        </div>
        <div className="space-y-2 text-left" dir="ltr">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Admin Password (Optional)</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-14 bg-foreground/[0.03] border-transparent font-medium"
            dir="ltr"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium text-center">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-[12px] font-black uppercase tracking-[0.4em] bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
      </Button>
    </form>
  )
}
