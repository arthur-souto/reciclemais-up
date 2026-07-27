import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/api/axios'
import { useCreateMaterial, useUpdateMaterial } from '@/hooks/useMaterials'
import { IMPORTANCE_TIERS } from '@/components/ImportanceBadge'
import { BASE_POINTS_BY_IMPORTANCE, Importance, type Material } from '@/types/material'


const materialSchema = z.object({
  name: z.string().min(1, 'Informe o nome do material').max(255, 'Nome muito longo'),
  importance: z.union([
    z.literal(Importance.EXTREMELY_LOW.value), z.literal(Importance.VERY_LOW.value), z.literal(Importance.LOW.value), z.literal(Importance.MEDIUM.value), z.literal(Importance.LOW_IMPORTANCE.value), z.literal(Importance.IMPORTANT.value), z.literal(Importance.VERY_IMPORTANT.value),
  ], "Selecione uma das opções mostradas"),
  points_value: z.coerce.number('Informe um número').int('Deve ser um número inteiro').min(0, 'Mínimo 0'),
})

type MaterialFormInput = z.input<typeof materialSchema>
type MaterialFormOutput = z.output<typeof materialSchema>

interface MaterialFormProps {
  material?: Material | null
  onSaved: () => void
}

export function MaterialForm({ material, onSaved }: MaterialFormProps) {
  const isEditing = material != null && material.id != null
  const createMaterial = useCreateMaterial()
  const updateMaterial = useUpdateMaterial(material?.id ?? 0)

  const defaultImportance = material?.importance ?? Importance.EXTREMELY_LOW.value

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaterialFormInput, unknown, MaterialFormOutput>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name ?? '',
      importance: defaultImportance,
      points_value: material?.points_value ?? BASE_POINTS_BY_IMPORTANCE[defaultImportance],
    },
  })

  const isPending = createMaterial.isPending || updateMaterial.isPending
  const currentImportance = watch('importance')
  const suggestedPoints =
    typeof currentImportance === 'number' ? BASE_POINTS_BY_IMPORTANCE[currentImportance] : undefined

  function onSubmit(values: MaterialFormOutput) {
    if (isEditing) {
      updateMaterial.mutate(values, {
        onSuccess: () => {
          toast.success('Material atualizado com sucesso.')
          onSaved()
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, 'Não foi possível atualizar o material.')),
      })
      return
    }

    createMaterial.mutate(values, {
      onSuccess: () => {
        toast.success('Material criado com sucesso.')
        onSaved()
      },
      onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível criar o material.')),
    })

    
    
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Papelão"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="importance">Importância</Label>
        <Controller
          name="importance"
          control={control}
          render={({ field }) => (
            <div id="importance" role="radiogroup" aria-label="Importância" className="flex flex-wrap gap-1.5">
              {IMPORTANCE_TIERS.map((tier) => {
                const isSelected = field.value === tier.value

                return (
                  <button
                    key={tier.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      field.onChange(tier.value)
                      setValue('points_value', BASE_POINTS_BY_IMPORTANCE[tier.value])
                    }}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-transparent transition-opacity',
                      tier.className,
                      isSelected
                        ? 'ring-foreground/50'
                        : 'opacity-50 hover:opacity-80',
                    )}
                  >
                    {tier.label}
                  </button>
                )
              })}
            </div>
          )}
        />

        {errors.importance && (
          <span className="text-xs text-destructive">{errors.importance.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="points_value">Pontos por unidade</Label>
        <Input
          id="points_value"
          type="number"
          min={0}
          step={1}
          aria-invalid={!!errors.points_value}
          {...register('points_value')}
        />
        {errors.points_value ? (
          <span className="text-xs text-destructive">{errors.points_value.message}</span>
        ) : (
          suggestedPoints != null && (
            <span className="text-xs text-muted-foreground">
              Sugestão para esta importância: {suggestedPoints} pontos. Você pode ajustar livremente.
            </span>
          )
        )}
      </div>

      <Button type="submit" className="mt-2" loading={isPending}>
        Salvar
      </Button>
    </form>
  )
}
