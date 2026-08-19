import { socialApi } from './socialAxios'
import type { Media } from '@/types/media'

// Etapa 1 do fluxo de post com mídia: sobe o arquivo e recebe a URL, que é
// então repassada em `medias` na criação do post (ver post.api.ts).
export async function uploadMedia(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await socialApi.post<Media>('/v1/media/context', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function uploadMediaBatch(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const { data } = await socialApi.post<Media[]>('/v1/media/context/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
