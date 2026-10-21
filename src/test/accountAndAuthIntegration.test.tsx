import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider } from '../router/Router';
import { useAuthStore } from '../store/useAuthStore';
import { UserAvatar, getInitials } from '../components/Account/UserAvatar';
import { AccountMenu } from '../components/Account/AccountMenu';
import { AccountSettingsPage } from '../pages/AccountSettingsPage';

describe('Account Identity & Profile Integration Suite', () => {
  beforeEach(() => {
    useAuthStore.getState().signOut();
    localStorage.clear();
  });

  describe('UserAvatar & Initials Extractor', () => {
    it('extracts initials accurately from various name and email formats', () => {
      expect(getInitials('Commander Alex Vance')).toBe('CV');
      expect(getInitials('Alex Vance')).toBe('AV');
      expect(getInitials('Sarah')).toBe('SA');
      expect(getInitials('', 'controller@skywatch.aero')).toBe('CO');
      expect(getInitials('', '')).toBe('ATC');
    });

    it('renders initials badge with status indicator when active', () => {
      render(
        <UserAvatar
          name="Commander Alex Vance"
          showStatus={true}
          size="md"
        />
      );

      expect(screen.getByText('CV')).toBeInTheDocument();
      expect(screen.getByTitle(/Active Transponder Session/i)).toBeInTheDocument();
    });
  });

  describe('AccountMenu Component', () => {
    it('renders a prominent Sign In button when unauthenticated', () => {
      render(
        <RouterProvider>
          <AccountMenu />
        </RouterProvider>
      );

      const signInLink = screen.getByRole('link', { name: /Sign In/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/signin');
    });

    it('renders user identity, callsign, and popover when authenticated', async () => {
      useAuthStore.getState().demoLogin();

      render(
        <RouterProvider>
          <AccountMenu />
        </RouterProvider>
      );

      // Verify trigger shows name and callsign
      expect(screen.getByText(/Commander Alex Vance/i)).toBeInTheDocument();
      expect(screen.getByText('TOWER-LEAD')).toBeInTheDocument();

      // Click to open dropdown
      const trigger = screen.getByRole('button', { name: /Logged in as Commander Alex Vance/i });
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Check popover items
      expect(screen.getByText(/Profile & Settings/i)).toBeInTheDocument();
      expect(screen.getByText(/APPEARANCE MODE/i)).toBeInTheDocument();
      expect(screen.getByText(/Evaluator Demo/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign Out Session/i })).toBeInTheDocument();
    });

    it('allows signing out directly from the popover menu', async () => {
      useAuthStore.getState().demoLogin();

      render(
        <RouterProvider>
          <AccountMenu />
        </RouterProvider>
      );

      const trigger = screen.getByRole('button', { name: /Logged in as Commander Alex Vance/i });
      fireEvent.click(trigger);

      const signOutBtn = screen.getByRole('button', { name: /Sign Out Session/i });
      fireEvent.click(signOutBtn);

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().currentUser).toBeNull();
    });
  });

  describe('AccountSettingsPage', () => {
    it('prompts unauthenticated users to authenticate', () => {
      render(
        <RouterProvider>
          <AccountSettingsPage />
        </RouterProvider>
      );

      expect(screen.getByText(/Authentication Required/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Sign In to Access Account/i })).toBeInTheDocument();
    });

    it('renders full profile dossier, editable fields, and saves updates', async () => {
      useAuthStore.getState().demoLogin();

      render(
        <RouterProvider>
          <AccountSettingsPage />
        </RouterProvider>
      );

      // Check header and dossier banner
      expect(screen.getByText(/Account & Operations Settings/i)).toBeInTheDocument();
      expect(screen.getByText('Commander Alex Vance')).toBeInTheDocument();
      expect(screen.getByDisplayValue('controller@skywatch.aero')).toBeInTheDocument();

      // Edit name and callsign
      const nameInput = screen.getByDisplayValue('Commander Alex Vance');
      fireEvent.change(nameInput, { target: { value: 'Captain Alexander Vance' } });

      const saveBtn = screen.getByRole('button', { name: /Save Profile Changes/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(screen.getByText(/Profile dossier updated successfully/i)).toBeInTheDocument();
      });

      expect(useAuthStore.getState().currentUser?.name).toBe('Captain Alexander Vance');
    });

    it('allows clearing the pinned watchlist with confirmation', async () => {
      useAuthStore.getState().demoLogin();
      expect(useAuthStore.getState().currentUser?.watchlist.length).toBeGreaterThan(0);

      render(
        <RouterProvider>
          <AccountSettingsPage />
        </RouterProvider>
      );

      const clearBtn = screen.getByRole('button', { name: /Clear Watchlist/i });
      fireEvent.click(clearBtn);

      const confirmBtn = screen.getByRole('button', { name: /Confirm Clear/i });
      fireEvent.click(confirmBtn);

      expect(useAuthStore.getState().currentUser?.watchlist.length).toBe(0);
    });
  });
});
