import { Timeline, Tag } from 'antd'
import {
  InfoCircleOutlined,
  CloudOutlined,
  CodeOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons'

export default function AboutPage() {
  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 760 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <InfoCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
            <span className="gradient-text">About This App</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 13 }}>
            Architecture, tech choices, and deployment details
          </p>
        </div>
      </div>

      {/* Description Card */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, fontSize: 15, margin: 0 }}>
          This is a sample full-stack application demonstrating a production-ready architecture
          using <strong style={{ color: 'var(--color-text-primary)' }}>React 19</strong> on the frontend
          and <strong style={{ color: 'var(--color-text-primary)' }}>Node.js + Express</strong> on the backend,
          containerized with <strong style={{ color: 'var(--color-text-primary)' }}>Docker</strong> and
          deployed to <strong style={{ color: 'var(--color-text-primary)' }}>Google Cloud Run</strong>.
        </p>
      </div>

      {/* Architecture Timeline */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: 'var(--color-text-primary)' }}>
          Architecture
        </h2>
        <Timeline
          items={[
            {
              dot: <CodeOutlined style={{ color: 'var(--color-brand-primary)' }} />,
              children: (
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>Frontend</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 8 }}>
                    React 19 + Vite + TypeScript, Ant Design 5.x, Tailwind CSS, React Router v6
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['React 19', 'Vite', 'AntD 5', 'Tailwind v4', 'React Router'].map((t) => (
                      <Tag key={t} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: 'var(--color-brand-primary)', borderRadius: 6, fontSize: 11 }}>{t}</Tag>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              dot: <DeploymentUnitOutlined style={{ color: '#68d391' }} />,
              children: (
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>Backend</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 8 }}>
                    Node.js 20 + Express 4 + TypeScript, CORS, Helmet, Morgan, modular routes
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['Node 20', 'Express 4', 'TypeScript', 'Helmet', 'Morgan'].map((t) => (
                      <Tag key={t} style={{ background: 'rgba(104,211,145,0.1)', border: '1px solid rgba(104,211,145,0.25)', color: '#68d391', borderRadius: 6, fontSize: 11 }}>{t}</Tag>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              dot: <CloudOutlined style={{ color: '#fbbc04' }} />,
              children: (
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>Cloud Deployment</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 8 }}>
                    Both services containerized via multi-stage Docker builds and deployed to Google Cloud Run
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['Docker', 'Cloud Run', 'Artifact Registry', 'Cloud Build'].map((t) => (
                      <Tag key={t} style={{ background: 'rgba(251,188,4,0.1)', border: '1px solid rgba(251,188,4,0.25)', color: '#fbbc04', borderRadius: 6, fontSize: 11 }}>{t}</Tag>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
