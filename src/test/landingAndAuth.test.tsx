import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider } from '../router/Router';
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/Auth/SignInPage';
import { SignUpPage } from '../pages/Auth/SignUpPage';
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage';
import { useAuthStore } from '../store/useAuthStore';
import { PRESET_REGIONS, DEFAULT_REGION } from '../constants/regions';

describe('Landing Page & Authentication Suite', () => {
  beforeEach(() => {
    useAuthStore.getState().signOut();
    localStorage.clear();
  });

  describe('Landing Page', () => {
    it('renders the exact required headline and copy', () => {
      render(
        <RouterProvider>
          <LandingPage />
        </RouterProvider>
      );

      // Check required headline
      expect(
        screen.getByRole('heading', { level: 1, name: /Global Air Traffic\. One Clear View\./i })
      ).toBeInTheDocument();

      // Check required supporting copy
      expect(
        screen.getByText(
          /Explore aircraft movements across the globe through an interactive flight-monitoring experience built for clarity, situational awareness, and smarter aviation insights\./i
        )
      ).toBeInTheDocument();

      // Check primary CTAs
      expect(screen.getByRole('button', { name: /Explore Live Traffic/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Learn How It Works/i })).toBeInTheDocument();
      expect(screen.getAllByText(/AIRTRAFFICCONTROL/i).length).toBeGreaterThanOrEqual(1);
    });

    it('renders the 3 operational steps and trust disclosures', () => {
      render(
        <RouterProvider>
          <LandingPage />
        </RouterProvider>
      );

      expect(screen.getByText(/Open Global Traffic View/i)).toBeInTheDocument();
      expect(screen.getByText(/Filter & Refine Targets/i)).toBeInTheDocument();
      expect(screen.getByText(/Inspect Live Telemetry/i)).toBeInTheDocument();
      expect(screen.getByText(/Trust, Data Transparency & API Policy/i)).toBeInTheDocument();
    });
  });

  describe('Authentication Store & Pages', () => {
    it('allows instant 1-click evaluator login via demoLogin', () => {
      const { demoLogin } = useAuthStore.getState();
      demoLogin();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.currentUser).not.toBeNull();
      expect(state.currentUser?.callsign).toBe('TOWER-LEAD');
      expect(state.currentUser?.role).toContain('Controller');
    });

    it('toggles pinned flights in the user watchlist', () => {
      const { demoLogin, toggleWatchlist, isWatchlisted } = useAuthStore.getState();
      demoLogin();

      expect(isWatchlisted('40061e')).toBe(true);
      // Toggle off
      toggleWatchlist('40061e');
      expect(isWatchlisted('40061e')).toBe(false);
      // Toggle on
      toggleWatchlist('40061e');
      expect(isWatchlisted('40061e')).toBe(true);
    });

    it('renders SignInPage with demo button and validation', async () => {
      render(
        <RouterProvider>
          <SignInPage />
        </RouterProvider>
      );

      expect(screen.getByText(/Controller Sign In/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In as Commander Vance/i })).toBeInTheDocument();

      // Submit empty
      const submitBtn = screen.getByRole('button', { name: /Sign In to Console/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Please enter your email address/i)).toBeInTheDocument();
      });
    });

    it('renders SignUpPage and validates password length', async () => {
      render(
        <RouterProvider>
          <SignUpPage />
        </RouterProvider>
      );

      expect(screen.getByText(/Register Controller Profile/i)).toBeInTheDocument();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Controller Email/i);
      const passInput = screen.getByLabelText(/^Password/i);
      const confirmInput = screen.getByLabelText(/Confirm Password/i);

      fireEvent.change(nameInput, { target: { value: 'Alex' } });
      fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
      fireEvent.change(passInput, { target: { value: 'short' } });
      fireEvent.change(confirmInput, { target: { value: 'short' } });

      const submitBtn = screen.getByRole('button', { name: /Complete Registration/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('renders ForgotPasswordPage and handles reset request', async () => {
      render(
        <RouterProvider>
          <ForgotPasswordPage />
        </RouterProvider>
      );

      const emailInput = screen.getByLabelText(/Registered Email/i);
      fireEvent.change(emailInput, { target: { value: 'controller@skywatch.aero' } });

      const submitBtn = screen.getByRole('button', { name: /Send Recovery Link/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Reset Instructions Dispatched/i)).toBeInTheDocument();
      });
    });
  });

  describe('Global Airspace & Continental Presets', () => {
    it('sets Global View (Worldwide) as the default sector', () => {
      expect(DEFAULT_REGION.id).toBe('global');
      expect(DEFAULT_REGION.name).toContain('Global View');
      expect(DEFAULT_REGION.zoom).toBe(2);
      expect(DEFAULT_REGION.center).toEqual([20, 0]);
    });

    it('provides all 6 required continental sectors plus global overview', () => {
      const ids = PRESET_REGIONS.map((r) => r.id);
      expect(ids).toContain('global');
      expect(ids).toContain('north-america');
      expect(ids).toContain('europe');
      expect(ids).toContain('asia-pacific');
      expect(ids).toContain('middle-east');
      expect(ids).toContain('latin-america');
      expect(ids).toContain('africa');
      expect(ids).toContain('oceania');
    });
  });
});
