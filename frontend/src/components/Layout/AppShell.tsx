import { useEffect, useState } from 'react'

import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Layout, Menu, Badge, Tooltip, Avatar } from 'antd'

import {
  DashboardOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloudOutlined,
} from '@ant-design/icons'
import { useAppContext } from '../../context/AppContext'
import apiClient from '../../utils/api'

const { Sider, Header, Content } = Layout

const NAV_ITEMS = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/items', icon: <UnorderedListOutlined />, label: 'Items' },
  { key: '/about', icon: <InfoCircleOutlined />, label: 'About' },
]

const STATUS_COLOR: Record<string, string> = {
  healthy: '#22c55e',
  unreachable: '#ef4444',
  unknown: '#f59e0b',
}

export default function AppShell() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { backendStatus, setBackendStatus, sidebarCollapsed, toggleSidebar } = useAppContext()
  const [time, setTime] = useState(new Date())

  // Ping backend health endpoint
  useEffect(() => {
    const ping = async () => {
      try {
        await apiClient.get('/health')
        setBackendStatus('healthy')
      } catch {
        setBackendStatus('unreachable')
      }
    }
    ping()
    const interval = setInterval(ping, 30_000)
    return () => clearInterval(interval)
  }, [setBackendStatus])

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const selectedKey = NAV_ITEMS.find((i) => i.key === pathname)?.key ?? '/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={sidebarCollapsed}
        trigger={null}
        width={220}
        style={{
          background: 'var(--color-bg-surface)',
          borderRight: '1px solid var(--color-border)',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? 0 : '0 20px',
            borderBottom: '1px solid var(--color-border)',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <CloudOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          {!sidebarCollapsed && (
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                background: 'var(--gradient-brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                whiteSpace: 'nowrap',
              }}
            >
              CloudApp
            </span>
          )}
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ marginTop: 8, background: 'transparent', border: 'none' }}
          onClick={({ key }) => navigate(key)}
          items={NAV_ITEMS.map((item) => ({
            ...item,
            style: {
              borderRadius: 10,
              margin: '2px 8px',
              color: 'var(--color-text-secondary)',
            },
          }))}
        />

        {/* Backend status indicator */}
        {!sidebarCollapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 12,
              right: 12,
              padding: '10px 14px',
              background: 'rgba(99,102,241,0.08)',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Badge color={STATUS_COLOR[backendStatus]} />
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              API: <strong style={{ color: STATUS_COLOR[backendStatus] }}>{backendStatus}</strong>
            </span>
          </div>
        )}
      </Sider>

      {/* ── Main Layout ──────────────────────────────────────────────────── */}
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 220, transition: 'margin 0.2s', background: 'transparent' }}>
        {/* Header */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 99,
            height: 64,
            background: 'rgba(15,15,26,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <button
            id="sidebar-toggle-btn"
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: 16,
              transition: 'all var(--transition-base)',
            }}
          >
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {time.toLocaleTimeString()}
            </span>
            <Tooltip title="Hosted on Google Cloud Run">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  background: 'rgba(99,102,241,0.1)',
                  borderRadius: 20,
                  border: '1px solid var(--color-border)',
                  cursor: 'default',
                }}
              >
                <CloudOutlined style={{ color: 'var(--color-brand-primary)', fontSize: 13 }} />
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Cloud Run</span>
              </div>
            </Tooltip>
            <Avatar
              style={{ background: 'var(--gradient-brand)', cursor: 'pointer' }}
              size={34}
            >
              U
            </Avatar>
          </div>
        </Header>

        {/* Page Content */}
        <Content style={{ padding: '32px 28px', flex: 1 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
