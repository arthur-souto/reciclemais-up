import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const ACCESS_TOKEN_KEY = 'accessToken'

interface AuthContextValue {
  accessToken: string | null
  isAuthenticated: boolean
  login: (accessToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY),
  )

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  }, [accessToken])

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: !!accessToken,
      login: setAccessToken,
      logout: () => setAccessToken(null),
    }),
    [accessToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider')
  }
  return context
}
