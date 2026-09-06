import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Popconfirm, message, Empty, Tag } from 'antd'
import { PlusOutlined, DeleteOutlined, ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useApi } from '../../../hooks/useApi'
import type { ColumnsType } from 'antd/es/table'

interface Item {
  id: string
  name: string
  description: string
  createdAt: string
}

interface ItemsResponse {
  items: Item[]
  total: number
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const { loading: listLoading, execute: fetchItems } = useApi<ItemsResponse>()
  const { loading: createLoading, execute: createItem } = useApi<Item>()
  const { execute: deleteItem } = useApi()

  const loadItems = async () => {
    const res = await fetchItems({ method: 'GET', url: '/api/items' })
    if (res) setItems(res.items)
  }

  useEffect(() => { loadItems() }, [])

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      const newItem = await createItem({ method: 'POST', url: '/api/items', data: values })
      if (newItem) {
        setItems((prev) => [...prev, newItem])
        form.resetFields()
        setModalOpen(false)
        messageApi.success('Item created successfully!')
      }
    } catch { /* form validation error handled by AntD */ }
  }

  const handleDelete = async (id: string) => {
    await deleteItem({ method: 'DELETE', url: `/api/items/${id}` })
    setItems((prev) => prev.filter((i) => i.id !== id))
    messageApi.success('Item deleted')
  }

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      render: (id: string) => (
        <Tag style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--color-brand-primary)', borderRadius: 6, fontSize: 10 }}>
          {id.slice(0, 8)}...
        </Tag>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name: string) => <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{name}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (desc: string) => <span style={{ color: 'var(--color-text-secondary)' }}>{desc}</span>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (ts: string) => (
        <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
          {new Date(ts).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Item) => (
        <Popconfirm
          title="Delete this item?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button
            id={`delete-item-${record.id}`}
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    },
  ]

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 1000 }}>
      {contextHolder}

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <UnorderedListOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              <span className="gradient-text">Items Manager</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 13 }}>
              {items.length} item{items.length !== 1 ? 's' : ''} · powered by Express API
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            id="refresh-items-btn"
            icon={<ReloadOutlined />}
            onClick={loadItems}
            loading={listLoading}
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-btn)',
            }}
          />
          <Button
            id="create-item-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            style={{
              background: 'var(--gradient-brand)',
              border: 'none',
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            New Item
          </Button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <Table
          id="items-table"
          dataSource={items}
          columns={columns}
          rowKey="id"
          loading={listLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{
            emptyText: (
              <Empty
                description={<span style={{ color: 'var(--color-text-secondary)' }}>No items yet. Create one!</span>}
                style={{ padding: 40 }}
              />
            ),
          }}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* ── Create Modal ─────────────────────────────────────────────────── */}
      <Modal
        title={<span style={{ color: 'var(--color-text-primary)' }}>Create New Item</span>}
        open={modalOpen}
        onOk={handleCreate}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        okText="Create"
        confirmLoading={createLoading}
        okButtonProps={{ style: { background: 'var(--gradient-brand)', border: 'none', borderRadius: 8 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label={<span style={{ color: 'var(--color-text-secondary)' }}>Name</span>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input
              id="item-name-input"
              placeholder="Enter item name"
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={<span style={{ color: 'var(--color-text-secondary)' }}>Description</span>}
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <Input.TextArea
              id="item-description-input"
              placeholder="Enter item description"
              rows={3}
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
