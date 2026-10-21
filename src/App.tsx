import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { SignInPage } from './pages/Auth/SignInPage';
import { SignUpPage } from './pages/Auth/SignUpPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';

const AppRoutes: React.FC = () => {
  const { path } = useRouter();

  // Normalize path
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '').toLowerCase();

  switch (normalized) {
    case '/':
      return <LandingPage />;
    case '/dashboard':
      return <DashboardPage />;
    case '/account':
    case '/settings':
      return <AccountSettingsPage />;
    case '/signin':
      return <SignInPage />;
    case '/signup':
      return <SignUpPage />;
    case '/forgot-password':
      return <ForgotPasswordPage />;
    default:
      if (normalized.startsWith('/dashboard')) {
        return <DashboardPage />;
      }
      if (normalized.startsWith('/account') || normalized.startsWith('/settings')) {
        return <AccountSettingsPage />;
      }
      return <LandingPage />;
  }
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
};

export default App;
