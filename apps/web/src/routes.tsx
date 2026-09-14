import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/auth-layout'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import {
  CatalogPage,
  CollaboratorsPage,
  DashboardPage,
  RulesPage,
  SalesPage,
  SettingsPage,
  TerminalsPage,
} from '@/pages/sections'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/collaborators', element: <CollaboratorsPage /> },
      { path: '/rules', element: <RulesPage /> },
      { path: '/catalog', element: <CatalogPage /> },
      { path: '/terminals', element: <TerminalsPage /> },
      { path: '/sales', element: <SalesPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
