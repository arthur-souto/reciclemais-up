import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
