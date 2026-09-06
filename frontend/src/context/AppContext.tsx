import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AppState {
  backendStatus: 'unknown' | 'healthy' | 'unreachable'
  setBackendStatus: (s: AppState['backendStatus']) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [backendStatus, setBackendStatus] = useState<AppState['backendStatus']>('unknown')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), [])

  return (
    <AppContext.Provider value={{ backendStatus, setBackendStatus, sidebarCollapsed, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
