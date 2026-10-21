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

      // Check required headline: "See the Skies. Understand the Movement."
      expect(
        screen.getByRole('heading', { level: 1, name: /See the Skies\.\s+Understand the Movement\./i })
      ).toBeInTheDocument();

      // Check required supporting copy
      expect(
        screen.getByText(
          /Explore global aircraft activity through an interactive map, location-aware discovery, and real-time flight data where available\./i
        )
      ).toBeInTheDocument();

      // Check primary CTAs
      expect(screen.getByRole('button', { name: /Explore Live Traffic/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Discover the Platform/i })).toBeInTheDocument();
      expect(screen.getAllByText(/AIRTRAFFICCONTROL/i).length).toBeGreaterThanOrEqual(1);
    });

    it('renders the operational steps, Google Maps integration, and trust disclosures', () => {
      render(
        <RouterProvider>
          <LandingPage />
        </RouterProvider>
      );

      expect(screen.getByText(/Google Maps Platform \+ OSM/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Location-Aware Discovery/i).length).toBeGreaterThanOrEqual(1);
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

  describe('Location-Driven Discovery & Dual Engine Integration', () => {
    it('creates radius bounding box correctly', async () => {
      const { createRadiusBoundingBox } = await import('../services/geoUtils');
      const bounds = createRadiusBoundingBox(51.47, -0.45, 50); // LHR 50km
      expect(bounds.lamin).toBeLessThan(51.47);
      expect(bounds.lamax).toBeGreaterThan(51.47);
      expect(bounds.lomin).toBeLessThan(-0.45);
      expect(bounds.lomax).toBeGreaterThan(-0.45);
    });

    it('stores and switches map engine between google and leaflet', async () => {
      const { useAtcStore } = await import('../store/useAtcStore');
      const store = useAtcStore.getState();

      store.setMapEngine('google');
      expect(useAtcStore.getState().mapEngine).toBe('google');

      store.setMapEngine('leaflet');
      expect(useAtcStore.getState().mapEngine).toBe('leaflet');
    });

    it('sets and updates monitoring target and radius', async () => {
      const { useAtcStore } = await import('../store/useAtcStore');
      const store = useAtcStore.getState();

      store.setMonitoringTarget({
        name: 'London Heathrow Airport (LHR)',
        lat: 51.47,
        lng: -0.45,
        radiusKm: 50,
      });

      expect(useAtcStore.getState().monitoringTarget).not.toBeNull();
      expect(useAtcStore.getState().monitoringTarget?.name).toContain('Heathrow');
      expect(useAtcStore.getState().monitoringTarget?.radiusKm).toBe(50);

      // Adjust radius to 100km
      store.setMonitoringRadius(100);
      expect(useAtcStore.getState().monitoringTarget?.radiusKm).toBe(100);

      // Clear target
      store.setMonitoringTarget(null);
      expect(useAtcStore.getState().monitoringTarget).toBeNull();
    });

    it('renders LocationSearchControl and shows popular hubs', async () => {
      const { LocationSearchControl } = await import('../components/Location/LocationSearchControl');
      render(<LocationSearchControl onSelectLocation={() => {}} />);

      const input = screen.getByPlaceholderText(/Search airport, city, or sector/i);
      expect(input).toBeInTheDocument();

      fireEvent.focus(input);
      expect(screen.getByText(/Featured Global Hubs/i)).toBeInTheDocument();
      expect(screen.getByText('LHR')).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
    });
  });
});
