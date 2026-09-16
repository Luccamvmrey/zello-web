import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/admin-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { OnboardingLayout } from '@/layouts/onboarding-layout'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { OnboardingPage } from '@/pages/onboarding'
import { DashboardPage } from '@/pages/dashboard'
import { SettingsPage } from '@/pages/settings'
import { SalesPage } from '@/pages/sections'
import { CollaboratorsPage } from '@/features/collaborators/pages/collaborators-page'
import { RulesPage } from '@/features/rules/pages/rules-page'
import { CatalogPage } from '@/features/catalog/pages/catalog-page'
import { TerminalsPage } from '@/features/terminals/pages/terminals-page'
import { TerminalDetailPage } from '@/features/terminals/pages/terminal-detail-page'
import { SolicitationsPage } from '@/features/solicitations/pages/solicitations-page'
import { AdminOverviewPage } from '@/pages/admin-overview'
import { AdminAccountsPage } from '@/features/admin/pages/admin-accounts-page'
import { AdminSolicitationsPage } from '@/features/admin-solicitations/pages/admin-solicitations-page'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <OnboardingLayout />,
    children: [{ path: '/onboarding', element: <OnboardingPage /> }],
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
      { path: '/terminals/:id', element: <TerminalDetailPage /> },
      { path: '/solicitations', element: <SolicitationsPage /> },
      { path: '/sales', element: <SalesPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin', element: <AdminOverviewPage /> },
      { path: '/admin/accounts', element: <AdminAccountsPage /> },
      { path: '/admin/solicitations', element: <AdminSolicitationsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
