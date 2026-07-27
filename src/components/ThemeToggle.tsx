import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeContext } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext()

  return (
    <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Alternar tema">
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
