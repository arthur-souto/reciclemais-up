import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getApiErrorMessage } from '@/api/axios'
import { useCreateMaterial, useUpdateMaterial } from '@/hooks/useMaterials'
import { Importance, type Material } from '@/types/material'


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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormInput, unknown, MaterialFormOutput>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name ?? '',
      importance: material?.importance ?? 1,
      points_value: material?.points_value ?? 0,
    },
  })

  const isPending = createMaterial.isPending || updateMaterial.isPending

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
    <form className="flex flex-col gap-4 px-4 pb-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
        <select
          id="importance"
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-invalid={!!errors.importance}
          {...register("importance", {
            setValueAs: (value) => Number(value),
          })}
        >
          <option value="">Selecione a importância</option>
          <option value={Importance.EXTREMELY_LOW.value}>Extremamente baixa</option>
          <option value={Importance.VERY_LOW.value}>Muito baixa</option>
          <option value={Importance.LOW.value}>Baixa</option>
          <option value={Importance.MEDIUM.value}>Mediana</option>
          <option value={Importance.LOW_IMPORTANCE.value}>Pouco Importante</option>
          <option value={Importance.IMPORTANT.value}>Importante</option>
          <option value={Importance.VERY_IMPORTANT.value}>Muito Importante</option>
        </select>

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
        {errors.points_value && (
          <span className="text-xs text-destructive">{errors.points_value.message}</span>
        )}
      </div>

      <Button type="submit" className="mt-2" loading={isPending}>
        Salvar
      </Button>
    </form>
  )
}
