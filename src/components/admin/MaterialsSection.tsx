import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Package, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Pagination } from '@/components/Pagination'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MaterialForm } from '@/components/admin/MaterialForm'
import { ImportanceBadge } from '@/components/ImportanceBadge'
import { getApiErrorMessage } from '@/api/axios'
import { useDeleteMaterial, useMaterialsSearch } from '@/hooks/useMaterials'
import { useUser } from '@/hooks/useUsers'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { Material } from '@/types/material'

const PAGE_SIZE = 10

function MaterialCreator({ userId }: { userId: string | null }) {
  const { data: user, isLoading } = useUser(userId ?? '')

  if (!userId) {
    return <span className="text-muted-foreground">—</span>
  }

  if (isLoading) {
    return <Skeleton className="h-4 w-24" />
  }

  return <span>{user?.name ?? '—'}</span>
}

export function MaterialsSection() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)
  const isSearching = debouncedSearch.trim().length > 0

  const { data, isLoading, isError, refetch } = useMaterialsSearch(debouncedSearch, {
    page,
    limit: PAGE_SIZE,
  })
  const materials = data?.payload
  const meta = data?.meta
  const deleteMaterial = useDeleteMaterial()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages)
    }
  }, [meta, page])

  function openCreateForm() {
    setEditingMaterial(null)
    setIsFormOpen(true)
  }

  function openEditForm(material: Material) {
    setEditingMaterial(material)
    setIsFormOpen(true)
  }

  function handleDelete(material: Material) {
    if (material.id == null) return
    const confirmed = window.confirm(`Excluir o material "${material.name}"? Esta ação não pode ser desfeita.`)
    if (!confirmed) return

    deleteMaterial.mutate(material.id, {
      onSuccess: () => toast.success('Material removido com sucesso.'),
      onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível remover o material.')),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Materiais</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os materiais recicláveis disponíveis na plataforma.
          </p>
        </div>
        <Button size="sm" onClick={openCreateForm}>
          <Plus />
          Novo material
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar material pelo nome..."
          className="pl-8"
          aria-label="Buscar material pelo nome"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
            <span className="sr-only">Limpar busca</span>
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState mensagem="Não foi possível carregar os materiais." onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && materials?.length === 0 && (
        <EmptyState
          mensagem={
            isSearching
              ? `Nenhum material encontrado para "${debouncedSearch.trim()}".`
              : 'Nenhum material cadastrado ainda.'
          }
          icon={isSearching ? Search : Package}
        />
      )}

      {!isLoading && !isError && materials != null && materials.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Nome</th>
                <th className="px-3 py-2 font-medium">Importância</th>
                <th className="px-3 py-2 font-medium">Pontos por unidade</th>
                <th className="px-3 py-2 font-medium">Criado por</th>
                <th className="px-3 py-2 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-foreground">{material.name}</td>
                  <td className="px-3 py-2 text-foreground">
                    <ImportanceBadge importance={material.importance} />
                  </td>
                  <td className="px-3 py-2 text-foreground">{material.points_value}</td>
                  <td className="px-3 py-2 text-foreground">
                    <MaterialCreator userId={material.fk_user} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditForm(material)}
                      >
                        <Pencil />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(material)}
                      >
                        <Trash2 />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && meta != null && meta.total > 0 && (
        <Pagination meta={meta} onPageChange={setPage} disabled={isLoading} />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMaterial ? 'Editar material' : 'Novo material'}</DialogTitle>
            <DialogDescription>
              {editingMaterial
                ? 'Atualize as informações do material selecionado.'
                : 'Preencha os dados para cadastrar um novo material.'}
            </DialogDescription>
          </DialogHeader>
          <MaterialForm material={editingMaterial} onSaved={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
