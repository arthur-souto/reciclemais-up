import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImageUploadField } from '@/components/ImageUploadField'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/api/axios'
import { useCreatePrize, useUpdatePrize } from '@/hooks/usePrizes'
import type { Prize } from '@/types/prize'

const selectClassName = cn(
  'h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30',
)

const prizeSchema = z.object({
  name: z.string().min(1, 'Informe o nome do prêmio').max(255, 'Nome muito longo'),
  required_points: z.coerce.number('Informe um número').int('Deve ser um número inteiro').min(1, 'Mínimo 1'),
  description: z.string().min(1, 'Informe a descrição'),
  category: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url('Informe uma URL válida')]).optional(),
  expiration_date: z.string().optional(),
  status: z.union([z.literal('ACTIVE'), z.literal('INACTIVE')]).optional(),
})

type PrizeFormInput = z.input<typeof prizeSchema>
type PrizeFormOutput = z.output<typeof prizeSchema>

interface PrizeFormProps {
  prize?: Prize | null
  onSaved: () => void
}

function toDateInputValue(isoDate: string | null) {
  return isoDate ? isoDate.slice(0, 10) : ''
}

export function PrizeForm({ prize, onSaved }: PrizeFormProps) {
  const isEditing = prize != null && prize.id != null
  const createPrize = useCreatePrize()
  const updatePrize = useUpdatePrize(prize?.id ?? 0)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PrizeFormInput, unknown, PrizeFormOutput>({
    resolver: zodResolver(prizeSchema),
    defaultValues: {
      name: prize?.name ?? '',
      required_points: prize?.required_points ?? 0,
      description: prize?.description ?? '',
      category: prize?.category ?? '',
      image_url: prize?.image_url ?? '',
      expiration_date: toDateInputValue(prize?.expiration_date ?? null),
      status: prize?.status ?? 'ACTIVE',
    },
  })

  const isPending = createPrize.isPending || updatePrize.isPending

  function onSubmit(values: PrizeFormOutput) {
    const image_url = values.image_url || undefined
    const expiration_date = values.expiration_date
      ? new Date(values.expiration_date).toISOString()
      : undefined

    if (isEditing) {
      updatePrize.mutate(
        {
          name: values.name,
          required_points: values.required_points,
          description: values.description,
          category: values.category?.trim() || undefined,
          image_url,
          expiration_date,
          status: values.status,
        },
        {
          onSuccess: () => {
            toast.success('Prêmio atualizado com sucesso.')
            onSaved()
          },
          onError: (error) =>
            toast.error(getApiErrorMessage(error, 'Não foi possível atualizar o prêmio.')),
        },
      )
      return
    }

    createPrize.mutate(
      {
        name: values.name,
        required_points: values.required_points,
        description: values.description,
        category: values.category?.trim() || null,
        image_url,
        expiration_date,
      },
      {
        onSuccess: () => {
          toast.success('Prêmio criado com sucesso.')
          onSaved()
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível criar o prêmio.')),
      },
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Ecobag reciclada"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descreva o prêmio"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <span className="text-xs text-destructive">{errors.description.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="required_points">Pontos necessários</Label>
          <Input
            id="required_points"
            type="number"
            min={1}
            step={1}
            aria-invalid={!!errors.required_points}
            {...register('required_points')}
          />
          {errors.required_points && (
            <span className="text-xs text-destructive">{errors.required_points.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Categoria</Label>
          <Input id="category" placeholder="Opcional" {...register('category')} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image_url">Imagem</Label>
        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <ImageUploadField id="image_url" value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.image_url && (
          <span className="text-xs text-destructive">{errors.image_url.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiration_date">Data de expiração</Label>
          <Input id="expiration_date" type="date" {...register('expiration_date')} />
        </div>

        {isEditing && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Status</Label>
            <select id="status" className={selectClassName} {...register('status')}>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>
        )}
      </div>

      <Button type="submit" className="mt-2" loading={isPending}>
        Salvar
      </Button>
    </form>
  )
}
