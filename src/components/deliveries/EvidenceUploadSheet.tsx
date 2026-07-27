import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Camera, CircleCheck, CircleX, Loader2, RefreshCw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/api/axios'
import { useRegisterEvidence } from '@/hooks/useEvidence'
import type { Delivery } from '@/types/delivery'
import type { EvidenceAnalysis } from '@/types/evidence'

interface EvidenceUploadSheetProps {
  delivery: Delivery
  onClose: () => void
}

export function EvidenceUploadSheet({ delivery, onClose }: EvidenceUploadSheetProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<EvidenceAnalysis | null>(null)
  const registerEvidence = useRegisterEvidence()

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selected)
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null)
    setAnalysis(null)
  }

  function handleAnalyze() {
    if (!file || delivery.id == null) return

    registerEvidence.mutate(
      { deliveryId: delivery.id, file },
      {
        onSuccess: (result) => setAnalysis(result),
        onError: (error) =>
          toast.error(getApiErrorMessage(error, 'Não foi possível analisar a evidência.')),
      },
    )
  }

  function handleRetry() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setAnalysis(null)
  }

  if (analysis) {
    return (
      <div className="flex flex-col gap-4">
        {analysis.valid ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-500/20 dark:bg-green-500/10">
            <CircleCheck className="size-10 text-green-600 dark:text-green-400" />
            <p className="font-medium text-foreground">Evidência aprovada!</p>
            <p className="text-sm text-muted-foreground">{analysis.reason}</p>
            <div className="mt-1 flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400">
              <Trophy className="size-4" />+{analysis.finalScore} pontos
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <CircleX className="size-10 text-destructive" />
            <p className="font-medium text-foreground">Evidência não aprovada</p>
            <p className="text-sm text-muted-foreground">{analysis.reason}</p>
          </div>
        )}

        {analysis.valid ? (
          <Button type="button" onClick={onClose}>
            Concluir
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={handleRetry}>
            <RefreshCw />
            Tentar com outra foto
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <label
        htmlFor="evidence-file"
        className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 text-center hover:bg-muted/50"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Pré-visualização da evidência" className="size-full object-cover" />
        ) : (
          <>
            <Camera className="size-8 text-muted-foreground" />
            <span className="px-4 text-sm text-muted-foreground">
              Toque para tirar ou escolher uma foto
            </span>
          </>
        )}
      </label>
      <input
        id="evidence-file"
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleFileChange}
      />

      {registerEvidence.isPending && (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Analisando imagem... isso pode levar alguns segundos.
        </p>
      )}

      <Button
        type="button"
        onClick={handleAnalyze}
        disabled={!file}
        loading={registerEvidence.isPending}
      >
        Enviar para análise
      </Button>
    </div>
  )
}
