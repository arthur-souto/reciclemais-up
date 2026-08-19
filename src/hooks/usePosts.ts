import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, getPosts } from '@/api/post.api'
import type { CreatePostPayload } from '@/types/post'

const FEED_PAGE_SIZE = 10

export const postKeys = {
  all: ['posts'] as const,
  feed: () => [...postKeys.all, 'feed'] as const,
}

export function usePostsFeed() {
  return useInfiniteQuery({
    queryKey: postKeys.feed(),
    queryFn: ({ pageParam }) => getPosts({ page: pageParam, size: FEED_PAGE_SIZE, sort: 'createdAt,desc' }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.page.number + 1 >= lastPage.page.totalPages
      return isLastPage ? undefined : lastPage.page.number + 1
    },
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}
