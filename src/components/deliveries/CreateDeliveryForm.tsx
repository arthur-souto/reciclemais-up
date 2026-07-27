import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiErrorMessage } from '@/api/axios'
import { useCreateDelivery } from '@/hooks/useDeliveries'
import { useMaterials } from '@/hooks/useMaterials'

const deliverySchema = z.object({
  local: z.string().min(1, 'Informe o local').max(255, 'Local muito longo'),
  material_type: z.string().min(1, 'Informe o tipo de material').max(255, 'Tipo muito longo'),
  quantity: z.coerce.number('Informe um número').int('Deve ser um número inteiro').min(1, 'Mínimo 1'),
  fk_material: z.coerce.number('Selecione um material').int('Selecione um material'),
})

type DeliveryFormInput = z.input<typeof deliverySchema>
type DeliveryFormOutput = z.output<typeof deliverySchema>

interface CreateDeliveryFormProps {
  onSaved: () => void
}

export function CreateDeliveryForm({ onSaved }: CreateDeliveryFormProps) {
  const createDelivery = useCreateDelivery()
  const { data: materialsData, isLoading: isLoadingMaterials } = useMaterials({ limit: 100 })
  const materials = materialsData?.payload ?? []

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeliveryFormInput, unknown, DeliveryFormOutput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      local: '',
      material_type: '',
      quantity: 1,
      fk_material: undefined,
    },
  })

  function onSubmit(values: DeliveryFormOutput) {
    createDelivery.mutate(values, {
      onSuccess: () => {
        toast.success('Entrega registrada com sucesso.')
        onSaved()
      },
      onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível registrar a entrega.')),
    })
  }

  function handleMaterialChange(materialId: string) {
    const material = materials.find((item) => String(item.id) === materialId)
    if (material) {
      setValue('material_type', material.name)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fk_material">Material</Label>
        {isLoadingMaterials ? (
          <Skeleton className="h-10 w-full" />
        ) : materials.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhum material cadastrado ainda. Peça a um administrador para cadastrar um material antes de
            registrar entregas.
          </p>
        ) : (
          <select
            id="fk_material"
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            aria-invalid={!!errors.fk_material}
            {...register('fk_material', {
              setValueAs: (value) => (value === '' ? undefined : Number(value)),
              onChange: (event) => handleMaterialChange(event.target.value),
            })}
          >
            <option value="">Selecione um material</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id ?? ''}>
                {material.name}
              </option>
            ))}
          </select>
        )}
        {errors.fk_material && (
          <span className="text-xs text-destructive">{errors.fk_material.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="material_type">Tipo de material</Label>
        <Input
          id="material_type"
          placeholder="Plástico"
          aria-invalid={!!errors.material_type}
          {...register('material_type')}
        />
        {errors.material_type && (
          <span className="text-xs text-destructive">{errors.material_type.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="local">Local</Label>
        <Input
          id="local"
          placeholder="Ecoponto Centro"
          aria-invalid={!!errors.local}
          {...register('local')}
        />
        {errors.local && <span className="text-xs text-destructive">{errors.local.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          step={1}
          aria-invalid={!!errors.quantity}
          {...register('quantity')}
        />
        {errors.quantity && <span className="text-xs text-destructive">{errors.quantity.message}</span>}
      </div>

      <Button type="submit" className="mt-2" loading={createDelivery.isPending} disabled={materials.length === 0}>
        Registrar entrega
      </Button>
    </form>
  )
}
