import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  callsign: string;
  email: string;
  role: 'Senior Air Traffic Controller' | 'Radar Operations Specialist' | 'Flight Dispatcher' | 'Aviation Enthusiast';
  avatarUrl?: string;
  authProvider?: 'password' | 'demo' | 'google';
  emailVerified?: boolean;
  densityPreference?: 'comfortable' | 'compact';
  watchlist: string[];
  savedSectors: string[];
  createdAt: number;
  lastLoginAt?: number;
}

interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  authError: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, callsign: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (
    updates: Partial<Pick<UserProfile, 'name' | 'callsign' | 'role' | 'densityPreference' | 'avatarUrl'>>
  ) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  deleteAccount: () => Promise<boolean>;
  clearWatchlist: () => void;
  demoLogin: () => void;
  toggleWatchlist: (icao24: string) => void;
  isWatchlisted: (icao24: string) => boolean;
  clearError: () => void;
}

const STORAGE_KEY_AUTH = 'atc_auth_session_v1';
const STORAGE_KEY_USERS = 'atc_registered_users_v1';

// Seed demo user
const DEMO_USER: UserProfile = {
  id: 'usr-atc-001',
  name: 'Commander Alex Vance',
  callsign: 'TOWER-LEAD',
  email: 'controller@skywatch.aero',
  role: 'Senior Air Traffic Controller',
  authProvider: 'demo',
  emailVerified: true,
  densityPreference: 'comfortable',
  watchlist: ['40061e', 'a0b1c2', 'e0f1a2'],
  savedSectors: ['global', 'london-tma', 'new-york-tracon'],
  createdAt: 1718000000000,
  lastLoginAt: Date.now(),
};

function loadStoredSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Auth] Failed to restore session from localStorage', err);
  }
  return null;
}

function saveStoredSession(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  } catch (err) {
    console.warn('[Auth] Failed to write session to localStorage', err);
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUser = loadStoredSession();

  return {
    currentUser: initialUser,
    isAuthenticated: initialUser !== null,
    isLoading: false,
    isInitialized: true,
    authError: null,

    signIn: async (email: string, password: string): Promise<boolean> => {
      set({ isLoading: true, authError: null });
      // Simulate network verification
      await new Promise((res) => setTimeout(res, 350));

      const cleanEmail = email.trim().toLowerCase();

      // Check against demo user
      if (cleanEmail === DEMO_USER.email.toLowerCase()) {
        if (password.length >= 6) {
          const userWithTimestamp = { ...DEMO_USER, lastLoginAt: Date.now() };
          saveStoredSession(userWithTimestamp);
          set({ currentUser: userWithTimestamp, isAuthenticated: true, isLoading: false, authError: null });
          return true;
        } else {
          set({ isLoading: false, authError: 'Invalid password. Password must be at least 6 characters.' });
          return false;
        }
      }

      // Check against locally registered users
      try {
        const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
        const users: Array<UserProfile & { passwordHash: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

        if (found) {
          if (found.passwordHash === password || password.length >= 6) {
            const { passwordHash: _, ...profile } = found;
            const updatedProfile: UserProfile = {
              ...profile,
              authProvider: profile.authProvider ?? 'password',
              emailVerified: profile.emailVerified ?? true,
              densityPreference: profile.densityPreference ?? 'comfortable',
              lastLoginAt: Date.now(),
            };
            saveStoredSession(updatedProfile);
            set({ currentUser: updatedProfile, isAuthenticated: true, isLoading: false, authError: null });
            return true;
          } else {
            set({ isLoading: false, authError: 'Incorrect password for this account.' });
            return false;
          }
        }
      } catch {
        // Fall through
      }

      // If user not registered, check format
      if (!cleanEmail.includes('@') || password.length < 6) {
        set({
          isLoading: false,
          authError: 'Invalid credentials. Enter a valid email and minimum 6-character password, or use Quick Demo Login.',
        });
        return false;
      }

      // Auto-create provisional session for valid credentials
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: cleanEmail.split('@')[0].toUpperCase(),
        callsign: `ATC-${Math.floor(100 + Math.random() * 900)}`,
        email: cleanEmail,
        role: 'Radar Operations Specialist',
        authProvider: 'password',
        emailVerified: true,
        densityPreference: 'comfortable',
        watchlist: [],
        savedSectors: ['global'],
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      saveStoredSession(newUser);
      set({ currentUser: newUser, isAuthenticated: true, isLoading: false, authError: null });
      return true;
    },

    signUp: async (name: string, callsign: string, email: string, password: string): Promise<boolean> => {
      set({ isLoading: true, authError: null });
      await new Promise((res) => setTimeout(res, 400));

      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        set({ isLoading: false, authError: 'Please enter a valid email address.' });
        return false;
      }

      if (password.length < 8) {
        set({ isLoading: false, authError: 'Password must be at least 8 characters long.' });
        return false;
      }

      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim() || 'Radar Controller',
        callsign: (callsign.trim() || 'ATC-' + Math.floor(100 + Math.random() * 900)).toUpperCase(),
        email: cleanEmail,
        role: 'Radar Operations Specialist',
        authProvider: 'password',
        emailVerified: true,
        densityPreference: 'comfortable',
        watchlist: [],
        savedSectors: ['global'],
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      // Store in users registry
      try {
        const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
        const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        users.push({ ...newUser, passwordHash: password });
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      } catch {
        // Ignore
      }

      saveStoredSession(newUser);
      set({ currentUser: newUser, isAuthenticated: true, isLoading: false, authError: null });
      return true;
    },

    signOut: () => {
      saveStoredSession(null);
      set({ currentUser: null, isAuthenticated: false, authError: null });
    },

    resetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail.includes('@')) {
        return { success: false, message: 'Please provide a valid registered email address.' };
      }
      await new Promise((res) => setTimeout(res, 500));
      return {
        success: true,
        message: `A secure password reset authorization link has been dispatched to ${cleanEmail}. Check your inbox within 15 minutes.`,
      };
    },

    updateProfile: async (
      updates: Partial<Pick<UserProfile, 'name' | 'callsign' | 'role' | 'densityPreference' | 'avatarUrl'>>
    ): Promise<{ success: boolean; message: string }> => {
      const current = get().currentUser;
      if (!current) {
        return { success: false, message: 'No active session found.' };
      }

      if (updates.name !== undefined && !updates.name.trim()) {
        return { success: false, message: 'Name cannot be empty.' };
      }

      if (updates.callsign !== undefined && !updates.callsign.trim()) {
        return { success: false, message: 'Callsign cannot be empty.' };
      }

      const updatedUser: UserProfile = {
        ...current,
        ...updates,
        name: updates.name ? updates.name.trim() : current.name,
        callsign: updates.callsign ? updates.callsign.trim().toUpperCase() : current.callsign,
      };

      // Update in storage
      saveStoredSession(updatedUser);

      // Also update in registered users list
      try {
        const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
        if (storedUsersRaw) {
          const users: Array<UserProfile & { passwordHash: string }> = JSON.parse(storedUsersRaw);
          const idx = users.findIndex((u) => u.id === updatedUser.id || u.email.toLowerCase() === updatedUser.email.toLowerCase());
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...updatedUser };
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
          }
        }
      } catch {
        // Ignore
      }

      set({ currentUser: updatedUser });
      return { success: true, message: 'Profile dossier updated successfully.' };
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
      const current = get().currentUser;
      if (!current) {
        return { success: false, message: 'Authentication required.' };
      }

      if (!currentPassword) {
        return { success: false, message: 'Please enter your current password.' };
      }

      if (newPassword.length < 8) {
        return { success: false, message: 'New password must be at least 8 characters long.' };
      }

      // If registered user, update passwordHash
      try {
        const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
        if (storedUsersRaw) {
          const users: Array<UserProfile & { passwordHash: string }> = JSON.parse(storedUsersRaw);
          const found = users.find((u) => u.email.toLowerCase() === current.email.toLowerCase());
          if (found && found.passwordHash !== currentPassword) {
            return { success: false, message: 'Current password does not match existing record.' };
          }
          if (found) {
            found.passwordHash = newPassword;
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
          }
        }
      } catch {
        // Ignore
      }

      await new Promise((res) => setTimeout(res, 400));
      return { success: true, message: 'Security credentials updated successfully.' };
    },

    deleteAccount: async (): Promise<boolean> => {
      const current = get().currentUser;
      if (!current) return false;

      try {
        const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
        if (storedUsersRaw) {
          const users: Array<UserProfile & { passwordHash: string }> = JSON.parse(storedUsersRaw);
          const filtered = users.filter((u) => u.id !== current.id && u.email.toLowerCase() !== current.email.toLowerCase());
          localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(filtered));
        }
      } catch {
        // Ignore
      }

      saveStoredSession(null);
      set({ currentUser: null, isAuthenticated: false, authError: null });
      return true;
    },

    clearWatchlist: () => {
      const current = get().currentUser;
      if (!current) return;
      const updatedUser: UserProfile = { ...current, watchlist: [] };
      saveStoredSession(updatedUser);
      set({ currentUser: updatedUser });
    },

    demoLogin: () => {
      const userWithTimestamp: UserProfile = {
        ...DEMO_USER,
        lastLoginAt: Date.now(),
      };
      saveStoredSession(userWithTimestamp);
      set({ currentUser: userWithTimestamp, isAuthenticated: true, isLoading: false, authError: null });
    },

    toggleWatchlist: (icao24: string) => {
      const current = get().currentUser;
      if (!current) return;

      const norm = icao24.toLowerCase().trim();
      const exists = current.watchlist.includes(norm);
      const updatedWatchlist = exists
        ? current.watchlist.filter((id) => id !== norm)
        : [...current.watchlist, norm];

      const updatedUser: UserProfile = { ...current, watchlist: updatedWatchlist };
      saveStoredSession(updatedUser);
      set({ currentUser: updatedUser });
    },

    isWatchlisted: (icao24: string) => {
      const current = get().currentUser;
      if (!current) return false;
      return current.watchlist.includes(icao24.toLowerCase().trim());
    },

    clearError: () => set({ authError: null }),
  };
});
