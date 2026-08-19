import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'sonner'
import { ImagePlus, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/UserAvatar'
import { useAuthContext } from '@/context/AuthContext'
import { useUser } from '@/hooks/useUsers'
import { useUploadMediaBatch } from '@/hooks/useMedia'
import { useCreatePost } from '@/hooks/usePosts'
import { getSocialApiErrorMessage } from '@/api/socialAxios'
import type { MediaType } from '@/types/media'

const MAX_MEDIA = 4
const ACCEPTED_PREFIXES = ['image/', 'video/']

// crypto.randomUUID só existe em contexto seguro (HTTPS ou localhost); em
// LAN via HTTP (ex.: acessando pelo IP da rede) ele não existe, então não dá
// pra depender dele aqui — é só uma key local, não precisa ser criptográfica.
function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

interface ComposerMediaItem {
  id: string
  file: File
  previewUrl: string
  type: MediaType
}

export function PostComposer() {
  const { user: sessionUser } = useAuthContext()
  // AuthContext guarda o snapshot capturado no login; se o usuário editou o
  // perfil depois, isso fica desatualizado. Busca ao vivo, igual ao UserMenu.
  const { data: liveUser } = useUser(sessionUser?.id ?? '')
  const user = liveUser ?? sessionUser
  const inputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState('')
  const [items, setItems] = useState<ComposerMediaItem[]>([])
  const uploadMediaBatch = useUploadMediaBatch()
  const createPost = useCreatePost()

  const isPublishing = uploadMediaBatch.isPending || createPost.isPending
  const canSubmit = (content.trim().length > 0 || items.length > 0) && !isPublishing

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    const remainingSlots = MAX_MEDIA - items.length
    if (remainingSlots <= 0) {
      toast.error(`Você pode anexar no máximo ${MAX_MEDIA} arquivos por post.`)
      return
    }

    const accepted = files
      .filter((file) => ACCEPTED_PREFIXES.some((prefix) => file.type.startsWith(prefix)))
      .slice(0, remainingSlots)

    if (accepted.length < files.length) {
      toast.error('Apenas imagens e vídeos podem ser anexados.')
    }

    // Só guarda o arquivo e a prévia local aqui. O upload pro R2 só acontece
    // ao publicar (handleSubmit), pra não subir mídia de posts que a pessoa
    // acaba desistindo ou removendo antes de publicar.
    const newItems: ComposerMediaItem[] = accepted.map((file) => ({
      id: createLocalId(),
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
    }))

    setItems((prev) => [...prev, ...newItems])
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((item) => item.id !== id)
    })
  }

  function resetComposer() {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    setContent('')
    setItems([])
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSubmit) return

    try {
      const medias = items.length > 0 ? await uploadMediaBatch.mutateAsync(items.map((item) => item.file)) : []
      await createPost.mutateAsync({ content: content.trim(), medias })

      toast.success('Post publicado!')
      resetComposer()
    } catch (error) {
      toast.error(getSocialApiErrorMessage(error, 'Não foi possível publicar o post.'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex gap-3">
        <UserAvatar
          src={user?.profile_image}
          seed={user?.id ?? user?.email ?? 'user'}
          alt={user?.name ?? 'Você'}
          className="size-10 shrink-0 sm:size-11"
        />

        <div className="min-w-0 flex-1">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="O que você reciclou hoje?"
            maxLength={2000}
            disabled={isPublishing}
            className="min-h-16 resize-none border-none bg-transparent px-0 py-1.5 text-base shadow-none focus-visible:ring-0"
          />

          {items.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  {item.type === 'VIDEO' ? (
                    <video src={item.previewUrl} className="size-full object-cover" muted />
                  ) : (
                    <img src={item.previewUrl} alt="" className="size-full object-cover" />
                  )}

                  {isPublishing && <div className="absolute inset-0 bg-background/50" />}

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={isPublishing}
                    aria-label="Remover mídia"
                    className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={items.length >= MAX_MEDIA || isPublishing}
              onClick={() => inputRef.current?.click()}
              aria-label="Anexar foto ou vídeo"
            >
              <ImagePlus className="text-primary" />
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="sr-only"
              onChange={handleFilesSelected}
            />

            <Button type="submit" size="sm" disabled={!canSubmit} loading={isPublishing}>
              <Send />
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
