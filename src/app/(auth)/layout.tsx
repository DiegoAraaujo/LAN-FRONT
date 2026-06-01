import { getTranslations } from 'next-intl/server'
import { GuestGuard } from '@/components/layout/GuestGuard'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations('auth')
  return (
    <GuestGuard>
      <div className="min-h-screen bg-bg flex">
        <div
          className="hidden lg:flex flex-col justify-between w-105 shrink-0 p-10"
          style={{ background: 'linear-gradient(160deg, #1E1E1E 0%, #2D3B45 100%)' }}
        >
          <div>
            <div className="text-gold-btn text-3xl font-extrabold tracking-tight mb-2">LAN</div>
            <div className="text-white/40 text-sm">Launched, Noted, Never Forgotten</div>
          </div>
          <div>
            <blockquote className="text-white/60 text-sm leading-relaxed italic mb-4">
              "Organize seu negócio, valorize cada cliente e acompanhe cada centavo faturado — tudo em um só lugar."
            </blockquote>
            <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className={`h-1 rounded-full ${i === 1 ? 'w-6 bg-gold-btn' : 'w-3 bg-white/20'}`} />
              ))}
            </div>
          </div>
          <div className="text-white/20 text-xs">© 2026 LAN System</div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          {children}
        </div>
      </div>
    </GuestGuard>
  )
}

export default AuthLayout
