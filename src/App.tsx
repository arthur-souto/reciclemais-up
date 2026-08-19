import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import Feed from '@/pages/Feed'
import Profile from '@/pages/Profile'
import Locations from '@/pages/Locations'
import PrizesCatalogPage from '@/pages/PrizesCatalogPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PublicRoute } from '@/components/PublicRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pontos-de-coleta"
        element={
          <ProtectedRoute>
            <Locations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/premios"
        element={
          <ProtectedRoute>
            <PrizesCatalogPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App