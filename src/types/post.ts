import type { Media } from './media'
import type { UserSnapshot } from './userSnapshot'

export interface CreatePostPayload {
  content: string
  medias?: Media[]
}

export interface CreatePostResponse {
  code: string
  statusCode: string
  message: string
  postCreatedId: string
  created_at: string
}

export interface Post {
  id: string
  authorId: string
  content: string
  medias: Media[]
  // Vem null quando o autor ainda não tem snapshot local no serviço social.
  author: UserSnapshot | null
  created_at: string
  updated_at: string | null
}
