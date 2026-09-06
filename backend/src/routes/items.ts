import { Router, Request, Response } from 'express';

export const itemsRouter = Router();

interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

// In-memory store (replace with a database in production)
let items: Item[] = [
  { id: 1, name: 'Sample Item A', description: 'First demo item', createdAt: new Date().toISOString() },
  { id: 2, name: 'Sample Item B', description: 'Second demo item', createdAt: new Date().toISOString() },
];
let nextId = 3;

// GET /api/items
itemsRouter.get('/', (_req: Request, res: Response) => {
  res.json({ items, total: items.length });
});

// GET /api/items/:id
itemsRouter.get('/:id', (req: Request, res: Response) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  res.json(item);
});

// POST /api/items
itemsRouter.post('/', (req: Request, res: Response) => {
  const { name, description } = req.body as { name?: string; description?: string };
  if (!name || !description) {
    res.status(400).json({ error: 'name and description are required' });
    return;
  }
  const newItem: Item = { id: nextId++, name, description, createdAt: new Date().toISOString() };
  items.push(newItem);
  res.status(201).json(newItem);
});

// DELETE /api/items/:id
itemsRouter.delete('/:id', (req: Request, res: Response) => {
  const index = items.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  const [removed] = items.splice(index, 1);
  res.json({ message: 'Item deleted', item: removed });
});
