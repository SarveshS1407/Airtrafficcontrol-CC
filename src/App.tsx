import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
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
