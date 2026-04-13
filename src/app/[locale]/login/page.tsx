import { getTranslations } from 'next-intl/server'
import { LoginForm } from './login-form'
import { Scissors } from 'lucide-react'

export default async function LoginPage() {
  const t = await getTranslations('Nav')
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass rounded-[2rem] border border-white/5 shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 bg-primary flex items-center justify-center mb-8 rounded-2xl shadow-xl">
           <Scissors className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest mb-2 text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm max-w-xs">{t('login')}</p>
        <LoginForm />
      </div>
    </div>
  )
}
