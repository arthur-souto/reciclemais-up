import { useMutation } from '@tanstack/react-query'
import { uploadImage } from '@/api/upload.api'

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
  })
}
