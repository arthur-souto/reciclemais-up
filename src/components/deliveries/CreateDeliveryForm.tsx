import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/api/axios'
import { geocodeAddress } from '@/lib/geocoding'
import { useCreateDelivery } from '@/hooks/useDeliveries'
import { useMaterials } from '@/hooks/useMaterials'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { LocationMapPicker } from '@/components/deliveries/LocationMapPicker'

const deliverySchema = z.object({
  local: z.string().min(1, 'Informe o local').max(255, 'Local muito longo'),
  material_type: z.string().min(1, 'Informe o tipo de material').max(255, 'Tipo muito longo'),
  quantity: z.coerce.number('Informe um número').int('Deve ser um número inteiro').min(1, 'Mínimo 1'),
  fk_material: z.coerce.number('Selecione um material').int('Selecione um material'),
  weight: z.coerce.number('Informe um número').int('O peso deve ser um número inteiro').min(1, 'Mínimo 1'),
  total_score: z.coerce
    .number('Informe um número')
    .int('A pontuação deve ser um número inteiro')
    .min(1, 'Mínimo 1'),
  latitude: z.coerce.number('Escolha um ponto no mapa'),
  longitude: z.coerce.number('Escolha um ponto no mapa'),
  collected_at: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value).getTime() : undefined)),
})

type DeliveryFormInput = z.input<typeof deliverySchema>
type DeliveryFormOutput = z.output<typeof deliverySchema>

const STEP_1_FIELDS = ['fk_material', 'material_type', 'quantity', 'weight', 'total_score', 'collected_at'] as const

interface CreateDeliveryFormProps {
  onSaved: () => void
}

function StepIndicator({
  index,
  label,
  active,
  done,
}: {
  index: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
          active || done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {index}
      </span>
      <span className={cn('text-xs font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </span>
    </div>
  )
}

export function CreateDeliveryForm({ onSaved }: CreateDeliveryFormProps) {
  const createDelivery = useCreateDelivery()
  const { data: materialsData, isLoading: isLoadingMaterials } = useMaterials({ limit: 100 })
  const materials = materialsData?.payload ?? []
  const [isLocating, setIsLocating] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<DeliveryFormInput, unknown, DeliveryFormOutput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      local: '',
      material_type: '',
      quantity: 1,
      fk_material: undefined,
      weight: 1,
      total_score: undefined,
      latitude: undefined,
      longitude: undefined,
      collected_at: '',
    },
  })

  const selectedMaterialId = watch('fk_material')
  const quantity = watch('quantity')
  const local = watch('local')
  const latitude = watch('latitude')
  const longitude = watch('longitude')
  const debouncedLocal = useDebouncedValue(local, 600)

  useEffect(() => {
    const material = materials.find((item) => String(item.id) === String(selectedMaterialId))
    if (material) {
      const suggestedQuantity = Number(quantity) > 0 ? Number(quantity) : 1
      setValue('total_score', material.points_value * suggestedQuantity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaterialId, quantity, materials])

  // Etapa 2: enquanto a pessoa digita o local, o mapa acompanha o endereço
  // buscando as coordenadas via geocodificação (Nominatim/OpenStreetMap).
  useEffect(() => {
    if (step !== 2) return

    const query = (debouncedLocal ?? '').trim()
    if (query.length < 3) return

    const controller = new AbortController()
    setIsGeocoding(true)

    geocodeAddress(query, controller.signal)
      .then((result) => {
        if (result) {
          setValue('latitude', result.lat, { shouldValidate: true })
          setValue('longitude', result.lon, { shouldValidate: true })
        }
      })
      .catch(() => {
        // Falha silenciosa: a pessoa ainda pode marcar o ponto manualmente no mapa.
      })
      .finally(() => setIsGeocoding(false))

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocal, step])

  async function handleNextStep() {
    const valid = await trigger(STEP_1_FIELDS)
    if (valid) setStep(2)
  }

  function onSubmit(values: DeliveryFormOutput) {
    // A API só aceita latitude/longitude como inteiros positivos (limitação
    // atual do backend); o mapa trabalha com as coordenadas reais e só
    // arredondamos aqui, na hora de montar o payload de envio.
    const payload = {
      ...values,
      latitude: Math.max(1, Math.round(Math.abs(values.latitude))),
      longitude: Math.max(1, Math.round(Math.abs(values.longitude))),
    }

    createDelivery.mutate(payload, {
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

  function handleMapChange(lat: number, lng: number) {
    setValue('latitude', lat, { shouldValidate: true })
    setValue('longitude', lng, { shouldValidate: true })
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada neste navegador.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude, { shouldValidate: true })
        setValue('longitude', position.coords.longitude, { shouldValidate: true })
        setIsLocating(false)
      },
      () => {
        toast.error('Não foi possível obter sua localização.')
        setIsLocating(false)
      },
    )
  }

  const numericLatitude = latitude != null && latitude !== '' ? Number(latitude) : null
  const numericLongitude = longitude != null && longitude !== '' ? Number(longitude) : null
  const hasValidCoords =
    numericLatitude != null && numericLongitude != null && !Number.isNaN(numericLatitude) && !Number.isNaN(numericLongitude)

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex items-center gap-2">
        <StepIndicator index={1} label="Informações básicas" active={step === 1} done={step === 2} />
        <div className={cn('h-px flex-1', step === 2 ? 'bg-primary/50' : 'bg-border')} />
        <StepIndicator index={2} label="Localização" active={step === 2} done={false} />
      </div>

      {step === 1 && (
        <>
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

          <div className="grid grid-cols-2 gap-3">
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={1}
                step={1}
                aria-invalid={!!errors.weight}
                {...register('weight')}
              />
              {errors.weight && <span className="text-xs text-destructive">{errors.weight.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="total_score">Pontuação</Label>
            <Input
              id="total_score"
              type="number"
              min={1}
              step={1}
              aria-invalid={!!errors.total_score}
              {...register('total_score')}
            />
            {errors.total_score ? (
              <span className="text-xs text-destructive">{errors.total_score.message}</span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Sugestão com base no material e na quantidade. Você pode ajustar livremente.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collected_at">Data da coleta (opcional)</Label>
            <Input id="collected_at" type="datetime-local" {...register('collected_at')} />
          </div>

          <Button
            type="button"
            className="mt-2"
            onClick={handleNextStep}
            disabled={materials.length === 0}
          >
            Próxima etapa
            <ArrowRight />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="local">Local</Label>
            <Input
              id="local"
              placeholder="Ecoponto Centro, São Paulo"
              aria-invalid={!!errors.local}
              {...register('local')}
            />
            {errors.local && <span className="text-xs text-destructive">{errors.local.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label>Localização no mapa</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleUseLocation} loading={isLocating}>
                <MapPin />
                Usar minha localização
              </Button>
            </div>

            <LocationMapPicker
              latitude={numericLatitude}
              longitude={numericLongitude}
              onChange={handleMapChange}
            />

            <p className="text-xs text-muted-foreground">
              {isGeocoding
                ? 'Localizando endereço...'
                : hasValidCoords
                  ? `${Math.abs(numericLatitude).toFixed(4)}° ${numericLatitude >= 0 ? 'N' : 'S'}, ${Math.abs(numericLongitude).toFixed(4)}° ${numericLongitude >= 0 ? 'L' : 'O'}`
                  : 'Digite o local acima, clique no mapa ou use sua localização.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="latitude" className="text-xs text-muted-foreground">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                aria-invalid={!!errors.latitude}
                {...register('latitude')}
              />
              {errors.latitude && <span className="text-xs text-destructive">{errors.latitude.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="longitude" className="text-xs text-muted-foreground">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                aria-invalid={!!errors.longitude}
                {...register('longitude')}
              />
              {errors.longitude && (
                <span className="text-xs text-destructive">{errors.longitude.message}</span>
              )}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            Ao enviar, as coordenadas são convertidas para números inteiros positivos (limitação atual da
            API) — a posição exata acima é só para você localizar o ponto no mapa.
          </span>

          <div className="mt-2 flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft />
              Voltar
            </Button>
            <Button type="submit" className="flex-1" loading={createDelivery.isPending}>
              Registrar entrega
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
