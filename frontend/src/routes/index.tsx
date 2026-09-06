import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from '../components/Layout/AppShell'
import HomePage from '../features/home/pages/HomePage'
import ItemsPage from '../features/items/pages/ItemsPage'
import AboutPage from '../features/about/pages/AboutPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'items', element: <ItemsPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
