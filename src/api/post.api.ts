import { socialApi } from './socialAxios'
import type { SpringPage } from '@/types/api'
import type { CreatePostPayload, CreatePostResponse, Post } from '@/types/post'

export interface PostListParams {
  page?: number
  size?: number
  sort?: string
}

export async function createPost(payload: CreatePostPayload) {
  const { data } = await socialApi.post<CreatePostResponse>('/v1/posts/context', payload)
  return data
}

export async function getPosts(params: PostListParams = {}) {
  const { data } = await socialApi.get<SpringPage<Post>>('/v1/posts/context', { params })
  return data
}
