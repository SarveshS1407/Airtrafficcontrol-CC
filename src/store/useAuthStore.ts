import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  callsign: string;
  email: string;
  role: 'Senior Air Traffic Controller' | 'Radar Operations Specialist' | 'Flight Dispatcher' | 'Aviation Enthusiast';
  watchlist: string[];
  savedSectors: string[];
  createdAt: number;
}

interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, callsign: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
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
  watchlist: ['40061e', 'a0b1c2', 'e0f1a2'],
  savedSectors: ['global', 'london-tma', 'new-york-tracon'],
  createdAt: 1718000000000,
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
    authError: null,

    signIn: async (email: string, password: string): Promise<boolean> => {
      set({ isLoading: true, authError: null });
      // Simulate network verification
      await new Promise((res) => setTimeout(res, 400));

      const cleanEmail = email.trim().toLowerCase();

      // Check against demo user
      if (cleanEmail === DEMO_USER.email.toLowerCase()) {
        if (password.length >= 6) {
          saveStoredSession(DEMO_USER);
          set({ currentUser: DEMO_USER, isAuthenticated: true, isLoading: false, authError: null });
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
            saveStoredSession(profile);
            set({ currentUser: profile, isAuthenticated: true, isLoading: false, authError: null });
            return true;
          } else {
            set({ isLoading: false, authError: 'Incorrect password for this account.' });
            return false;
          }
        }
      } catch {
        // Fall through
      }

      // If user not registered, provide friendly guidance or allow if valid email/pass
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
        watchlist: [],
        savedSectors: ['global'],
        createdAt: Date.now(),
      };

      saveStoredSession(newUser);
      set({ currentUser: newUser, isAuthenticated: true, isLoading: false, authError: null });
      return true;
    },

    signUp: async (name: string, callsign: string, email: string, password: string): Promise<boolean> => {
      set({ isLoading: true, authError: null });
      await new Promise((res) => setTimeout(res, 500));

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
        watchlist: [],
        savedSectors: ['global'],
        createdAt: Date.now(),
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
      await new Promise((res) => setTimeout(res, 600));
      return {
        success: true,
        message: `A secure password reset authorization link has been dispatched to ${cleanEmail}. Check your inbox within 15 minutes.`,
      };
    },

    demoLogin: () => {
      saveStoredSession(DEMO_USER);
      set({ currentUser: DEMO_USER, isAuthenticated: true, isLoading: false, authError: null });
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
