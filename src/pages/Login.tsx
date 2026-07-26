import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Recycle } from 'lucide-react'
import loginBackground from '@/assets/login-background.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/api/axios'

const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  function onSubmit(values: LoginForm) {
    login.mutate(values, {
      onSuccess: () => toast.success('Login realizado com sucesso.'),
      onError: (error) => toast.error(getApiErrorMessage(error, 'E-mail ou senha inválidos.')),
    })
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBackground})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />

      <div className="relative w-full max-w-sm rounded-xl border border-white/15 bg-black/30 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
            <Recycle className="size-5" />
          </div>
          <span className="text-lg font-semibold text-white">Recicle+</span>
        </div>

        <h1 className="text-2xl font-semibold text-white">Entrar na conta</h1>
        <p className="mt-1 text-sm text-white/70">
          Informe seus dados para acessar a plataforma.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            {errors.email && (
              <span className="text-xs text-red-300">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-white/90">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-xs text-red-300">{errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full bg-white text-black hover:bg-white/85"
            size="lg"
            loading={login.isPending}
          >
            Entrar
          </Button>
        </form>
      </div>
    </main>
  )
}
