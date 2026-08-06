import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Gift, Mail, MapPin, Pencil, Phone, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Pagination } from '@/components/Pagination'
import { UserAvatar } from '@/components/UserAvatar'
import { AppLayout } from '@/components/app/AppLayout'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EditProfileForm } from '@/components/profile/EditProfileForm'
import { RedemptionPrizeInfo } from '@/components/prizes/RedemptionPrizeInfo'
import { useAuthContext } from '@/context/AuthContext'
import { useUser } from '@/hooks/useUsers'
import { useMyRedemptions } from '@/hooks/usePrizeRedemptions'
import { formatCep, formatPhone } from '@/lib/format'
import { formatDate, formatDateTime } from '@/lib/date'
import type { AppSection } from '@/components/app/AppSidebar'

const REDEMPTIONS_PAGE_SIZE = 5

function RedeemedPrizesCard() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useMyRedemptions({ page, limit: REDEMPTIONS_PAGE_SIZE })
  const redemptions = data?.payload
  const meta = data?.meta

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages)
    }
  }, [meta, page])

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Gift className="size-5 text-primary" />
        Prêmios resgatados
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState mensagem="Não foi possível carregar seus resgates." onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && redemptions?.length === 0 && (
          <EmptyState mensagem="Você ainda não resgatou nenhum prêmio." icon={Gift} />
        )}

        {!isLoading && !isError && redemptions != null && redemptions.length > 0 && (
          <ul className="flex flex-col divide-y divide-border">
            {redemptions.map((redemption) => (
              <li key={redemption.id} className="flex items-center justify-between gap-3 py-3">
                <span className="text-base text-foreground">
                  <RedemptionPrizeInfo prizeId={redemption.fk_prize} />
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {formatDateTime(redemption.redeemed_at)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && !isError && meta != null && meta.total > 0 && (
          <Pagination meta={meta} onPageChange={setPage} disabled={isLoading} />
        )}
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user: sessionUser } = useAuthContext()
  const { data: user, isLoading, isError, refetch } = useUser(sessionUser?.id ?? '')
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <AppLayout
      title="Meu perfil"
      section="home"
      onSectionChange={(next: AppSection) => navigate(`/?section=${next}`)}
    >
      <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-8">
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
                <Wallet className="size-4 text-amber-500" />
                Meus pontos
              </p>
              <p className="mt-1 text-4xl font-bold text-foreground">{user.total_score}</p>
            </div>

            <RedeemedPrizesCard />

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
      </div>
    </AppLayout>
  )
}
