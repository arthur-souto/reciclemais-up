import { useMutation } from '@tanstack/react-query'
import { uploadMedia, uploadMediaBatch } from '@/api/media.api'

export function useUploadMedia() {
  return useMutation({
    mutationFn: (file: File) => uploadMedia(file),
  })
}

export function useUploadMediaBatch() {
  return useMutation({
    mutationFn: (files: File[]) => uploadMediaBatch(files),
  })
}
