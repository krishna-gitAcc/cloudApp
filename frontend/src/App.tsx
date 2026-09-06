import { ConfigProvider, theme } from 'antd'
import { AppProvider } from './context/AppContext'
import AppRouter from './routes'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          colorBgBase: '#0f0f1a',
          colorBgContainer: '#1e1e35',
          colorBgElevated: '#16213e',
          colorBorder: 'rgba(99, 102, 241, 0.15)',
          colorText: '#f0f0ff',
          colorTextSecondary: '#9395a5',
          fontFamily: "'Inter', system-ui, sans-serif",
          borderRadius: 10,
          borderRadiusLG: 16,
        },
      }}
    >
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ConfigProvider>
  )
}
