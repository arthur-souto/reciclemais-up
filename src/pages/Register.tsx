import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Recycle } from 'lucide-react'
import loginBackground from '@/assets/login-background.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserAvatar } from '@/components/UserAvatar'
import { useCreateUser } from '@/hooks/useUsers'
import { getApiErrorMessage } from '@/api/axios'
import { getAvatarUrl } from '@/lib/avatar'
import { isValidCpf } from '@/lib/cpf'

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  cpf: z.string().min(1, 'CPF é obrigatório').refine(isValidCpf, 'CPF inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  phone: z
    .union([z.literal(''), z.string().regex(/^\d{10,11}$/, 'Telefone inválido, informe DDD + número apenas com dígitos')])
    .optional(),
  cep: z
    .union([z.literal(''), z.string().regex(/^\d{8}$/, 'CEP inválido, informe apenas os 8 dígitos')])
    .optional(),
  address: z.union([z.literal(''), z.string().max(255, 'Endereço muito longo')]).optional(),
  profile_image: z.union([z.literal(''), z.string().url('URL da imagem de perfil inválida')]).optional(),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const createUser = useCreateUser()
  // Seed estável pro avatar sugerido enquanto a pessoa preenche o formulário.
  const [avatarSeed] = useState(() => crypto.randomUUID())

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const profileImage = watch('profile_image')

  function onSubmit(values: RegisterForm) {
    createUser.mutate(
      {
        name: values.name,
        email: values.email,
        cpf: values.cpf.replace(/\D/g, ''),
        password: values.password,
        phone: values.phone || undefined,
        cep: values.cep || undefined,
        address: values.address || undefined,
        // Se a pessoa não informou uma imagem, gera um avatar "bichinho" com
        // seed estável e já manda pronto — igual o GitHub faz no cadastro.
        profile_image: values.profile_image || getAvatarUrl(avatarSeed),
      },
      {
        onSuccess: () => {
          toast.success('Conta criada com sucesso. Faça login para continuar.')
          navigate('/login')
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível criar sua conta.')),
      },
    )
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden p-6 py-10">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBackground})` }}
      />
      <div aria-hidden="true" className="fixed inset-0 bg-black/50" />

      <div className="relative w-full max-w-md rounded-xl border border-white/15 bg-black/30 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
            <Recycle className="size-5" />
          </div>
          <span className="text-lg font-semibold text-white">Recicle+</span>
        </div>

        <h1 className="text-2xl font-semibold text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-white/70">Preencha seus dados para começar a reciclar.</p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col items-center gap-2">
            <UserAvatar src={profileImage} seed={avatarSeed} alt="Pré-visualização do avatar" className="size-16" />
            <span className="text-xs text-white/60">
              {profileImage ? 'Pré-visualização da imagem informada' : 'Avatar sugerido — você pode trocar depois'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile_image" className="text-white/90">
              URL da imagem de perfil (opcional)
            </Label>
            <Input
              id="profile_image"
              placeholder="https://..."
              aria-invalid={!!errors.profile_image}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
              {...register('profile_image')}
            />
            {errors.profile_image && (
              <span className="text-xs text-red-300">{errors.profile_image.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-white/90">
              Nome
            </Label>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
              {...register('name')}
            />
            {errors.name && <span className="text-xs text-red-300">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-white/90">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              aria-invalid={!!errors.email}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
              {...register('email')}
            />
            {errors.email && <span className="text-xs text-red-300">{errors.email.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cpf" className="text-white/90">
                CPF
              </Label>
              <Input
                id="cpf"
                placeholder="12345678900"
                aria-invalid={!!errors.cpf}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
                {...register('cpf')}
              />
              {errors.cpf && <span className="text-xs text-red-300">{errors.cpf.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-white/90">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
                {...register('password')}
              />
              {errors.password && <span className="text-xs text-red-300">{errors.password.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-white/90">
                Telefone (opcional)
              </Label>
              <Input
                id="phone"
                placeholder="11987654321"
                aria-invalid={!!errors.phone}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
                {...register('phone')}
              />
              {errors.phone && <span className="text-xs text-red-300">{errors.phone.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cep" className="text-white/90">
                CEP (opcional)
              </Label>
              <Input
                id="cep"
                placeholder="93010020"
                aria-invalid={!!errors.cep}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
                {...register('cep')}
              />
              {errors.cep && <span className="text-xs text-red-300">{errors.cep.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address" className="text-white/90">
              Endereço (opcional)
            </Label>
            <Input
              id="address"
              aria-invalid={!!errors.address}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
              {...register('address')}
            />
            {errors.address && <span className="text-xs text-red-300">{errors.address.message}</span>}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full bg-white text-black hover:bg-white/85"
            size="lg"
            loading={createUser.isPending}
          >
            Criar conta
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-white/70">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-white hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
