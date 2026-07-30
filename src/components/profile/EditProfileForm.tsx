import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserAvatar } from '@/components/UserAvatar'
import { getApiErrorMessage } from '@/api/axios'
import { useUpdateUser } from '@/hooks/useUsers'
import type { UpdateUserPayload, User } from '@/types/user'

const editProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  phone: z
    .union([z.literal(''), z.string().regex(/^\d{10,11}$/, 'Telefone inválido, informe DDD + número apenas com dígitos')])
    .optional(),
  cep: z
    .union([z.literal(''), z.string().regex(/^\d{8}$/, 'CEP inválido, informe apenas os 8 dígitos')])
    .optional(),
  address: z.union([z.literal(''), z.string().max(255, 'Endereço muito longo')]).optional(),
  profile_image: z.union([z.literal(''), z.string().url('URL da imagem de perfil inválida')]).optional(),
})

type EditProfileForm = z.infer<typeof editProfileSchema>

interface EditProfileFormProps {
  user: User
  onSaved: () => void
}

function buildUpdatePayload(values: EditProfileForm, original: User): UpdateUserPayload {
  const payload: UpdateUserPayload = {}

  if (values.name !== original.name) payload.name = values.name
  if (values.email !== original.email) payload.email = values.email
  if (values.phone && values.phone !== (original.phone ?? '')) payload.phone = values.phone
  if (values.cep && values.cep !== (original.cep ?? '')) payload.cep = values.cep
  if (values.address && values.address !== (original.address ?? '')) payload.address = values.address
  if (values.profile_image && values.profile_image !== (original.profile_image ?? '')) {
    payload.profile_image = values.profile_image
  }

  return payload
}

export function EditProfileForm({ user, onSaved }: EditProfileFormProps) {
  const updateUser = useUpdateUser(user.id ?? '')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      cep: user.cep ?? '',
      address: user.address ?? '',
      profile_image: user.profile_image ?? '',
    },
  })

  const previewImage = watch('profile_image')

  function onSubmit(values: EditProfileForm) {
    const payload = buildUpdatePayload(values, user)

    if (Object.keys(payload).length === 0) {
      onSaved()
      return
    }

    updateUser.mutate(payload, {
      onSuccess: () => {
        toast.success('Perfil atualizado com sucesso.')
        onSaved()
      },
      onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível atualizar o perfil.')),
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar
          src={previewImage || user.profile_image}
          seed={user.id ?? user.email}
          alt={user.name}
          className="size-16"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="profile_image">URL da imagem de perfil</Label>
        <Input
          id="profile_image"
          placeholder="https://..."
          aria-invalid={!!errors.profile_image}
          {...register('profile_image')}
        />
        {errors.profile_image && (
          <span className="text-xs text-destructive">{errors.profile_image.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" aria-invalid={!!errors.name} {...register('name')} />
        {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" aria-invalid={!!errors.email} {...register('email')} />
        {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="11987654321"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
          {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" placeholder="93010020" aria-invalid={!!errors.cep} {...register('cep')} />
          {errors.cep && <span className="text-xs text-destructive">{errors.cep.message}</span>}
        </div>
      </div>
      <span className="-mt-2 text-xs text-muted-foreground">
        Telefone e CEP: somente números (telefone com DDD, CEP com 8 dígitos).
      </span>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" aria-invalid={!!errors.address} {...register('address')} />
        {errors.address && <span className="text-xs text-destructive">{errors.address.message}</span>}
      </div>

      <Button type="submit" className="mt-2" loading={updateUser.isPending}>
        Salvar alterações
      </Button>
    </form>
  )
}
