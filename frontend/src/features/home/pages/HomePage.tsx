import { useEffect } from 'react'
import { Row, Col, Statistic, Tag } from 'antd'
import {
  CloudOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import { useAppContext } from '../../../context/AppContext'
import { useApi } from '../../../hooks/useApi'

interface HealthResponse {
  status: string
  timestamp: string
  uptime: number
}

const TECH_STACK = [
  { label: 'React 19', color: '#61dafb' },
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'Ant Design 5.x', color: '#1677ff' },
  { label: 'Vite', color: '#646cff' },
  { label: 'Express', color: '#68d391' },
  { label: 'Cloud Run', color: '#fbbc04' },
]

export default function HomePage() {
  const { backendStatus } = useAppContext()
  const { data, execute } = useApi<HealthResponse>()

  useEffect(() => {
    execute({ method: 'GET', url: '/health' })
  }, [execute])

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 1100 }}>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <RocketOutlined style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
              <span className="gradient-text">CloudApp</span> Dashboard
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 14 }}>
              React 19 + Node/Express · Deployed on Google Cloud Run
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        {[
          {
            id: 'stat-backend-status',
            title: 'Backend Status',
            icon: <ApiOutlined />,
            value: backendStatus.toUpperCase(),
            color: backendStatus === 'healthy' ? '#22c55e' : backendStatus === 'unreachable' ? '#ef4444' : '#f59e0b',
          },
          {
            id: 'stat-uptime',
            title: 'Server Uptime',
            icon: <ThunderboltOutlined />,
            value: data ? `${Math.round(data.uptime)}s` : '—',
            color: 'var(--color-brand-primary)',
          },
          {
            id: 'stat-cloud',
            title: 'Cloud Platform',
            icon: <CloudOutlined />,
            value: 'GCP',
            color: '#fbbc04',
          },
          {
            id: 'stat-env',
            title: 'Environment',
            icon: <RocketOutlined />,
            value: import.meta.env.MODE.toUpperCase(),
            color: 'var(--color-brand-accent)',
          },
        ].map((card) => (
          <Col key={card.id} xs={24} sm={12} lg={6}>
            <div
              id={card.id}
              className="glass-card"
              style={{ padding: '24px 20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ color: card.color, fontSize: 20 }}>{card.icon}</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 500 }}>
                  {card.title}
                </span>
              </div>
              <Statistic
                value={card.value}
                valueStyle={{
                  color: card.color,
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Tech Stack Tags ─────────────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--color-text-primary)' }}>
          Tech Stack
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {TECH_STACK.map((t) => (
            <Tag
              key={t.label}
              style={{
                background: `${t.color}18`,
                border: `1px solid ${t.color}44`,
                color: t.color,
                borderRadius: 8,
                padding: '5px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'default',
              }}
            >
              {t.label}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  )
}
