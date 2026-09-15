import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/auth-layout'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { OnboardingLayout } from '@/layouts/onboarding-layout'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { OnboardingPage } from '@/pages/onboarding'
import { DashboardPage } from '@/pages/dashboard'
import { SettingsPage } from '@/pages/settings'
import { SalesPage, TerminalsPage } from '@/pages/sections'
import { CollaboratorsPage } from '@/features/collaborators/pages/collaborators-page'
import { RulesPage } from '@/features/rules/pages/rules-page'
import { CatalogPage } from '@/features/catalog/pages/catalog-page'

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
      { path: '/sales', element: <SalesPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
