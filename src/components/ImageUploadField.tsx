import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Image as ImageIcon, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/api/axios'
import { useUploadImage } from '@/hooks/useUpload'
import { cn } from '@/lib/utils'

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploadFieldProps {
  id: string
  value: string | null | undefined
  onChange: (url: string) => void
  shape?: 'square' | 'circle'
  size?: number
  disabled?: boolean
}

export function ImageUploadField({
  id,
  value,
  onChange,
  shape = 'square',
  size = 80,
  disabled,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const uploadImage = useUploadImage()
  const isPending = uploadImage.isPending

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Formato inválido. Envie uma imagem PNG, JPEG ou WEBP.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error('A imagem deve ter no máximo 5MB.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))

    uploadImage.mutate(file, {
      onSuccess: (result) => onChange(result.url),
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Não foi possível enviar a imagem.'))
        setPreviewUrl(null)
      },
    })
  }

  const displaySrc = previewUrl ?? value ?? null

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor={id}
        className={cn(
          'relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-border bg-muted/30 hover:bg-muted/50',
          shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        )}
        style={{ width: size, height: size }}
      >
        {displaySrc ? (
          <img src={displaySrc} alt="" className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-6 text-muted-foreground" />
        )}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        disabled={disabled || isPending}
        onChange={handleFileChange}
      />
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {value ? 'Trocar imagem' : 'Enviar imagem'}
        </Button>
        <span className="text-xs text-muted-foreground">PNG, JPG ou WEBP, até 5MB.</span>
      </div>
    </div>
  )
}
