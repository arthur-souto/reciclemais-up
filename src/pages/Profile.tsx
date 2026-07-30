import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Recycle,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ErrorState'
import { UserAvatar } from '@/components/UserAvatar'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EditProfileForm } from '@/components/profile/EditProfileForm'
import { useAuthContext } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUsers'
import { formatCep, formatPhone } from '@/lib/format'
import { formatDate } from '@/lib/date'

export default function Profile() {
  const navigate = useNavigate()
  const logout = useLogout()
  const { user: sessionUser } = useAuthContext()
  const { data: user, isLoading, isError, refetch } = useUser(sessionUser?.id ?? '')
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <div className="min-h-svh w-full bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/')}>
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Recycle className="size-5" />
          </div>
          <span className="text-lg font-semibold text-foreground">Recicle+</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-8">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="size-24 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState mensagem="Não foi possível carregar seu perfil." onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && user && (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <UserAvatar
                src={user.profile_image}
                seed={user.id ?? user.email}
                alt={user.name}
                className="size-24"
              />
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button size="sm" onClick={() => setIsEditOpen(true)}>
                <Pencil />
                Editar perfil
              </Button>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                <Trophy className="size-4 text-amber-500" />
                Meus pontos
              </p>
              <p className="mt-1 text-4xl font-bold text-foreground">{user.total_score}</p>
            </div>

            <dl className="mt-6 flex flex-col divide-y divide-border rounded-xl border border-border">
              <div className="flex items-center gap-3 px-4 py-3">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">Telefone</dt>
                  <dd className="text-sm text-foreground">{formatPhone(user.phone) ?? '—'}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">Endereço</dt>
                  <dd className="text-sm text-foreground">
                    {user.address ?? '—'}
                    {user.cep ? ` · CEP ${formatCep(user.cep)}` : ''}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">E-mail</dt>
                  <dd className="text-sm text-foreground">{user.email}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">Membro desde</dt>
                  <dd className="text-sm text-foreground">{formatDate(user.created_at)}</dd>
                </div>
              </div>
            </dl>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar perfil</DialogTitle>
                  <DialogDescription>Atualize suas informações pessoais.</DialogDescription>
                </DialogHeader>
                <EditProfileForm user={user} onSaved={() => setIsEditOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>
    </div>
  )
}
