import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types/user';
import { authService } from '../services/authService';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  loginWithUsername: (username: string, password: string) => Promise<void>;
  registerWithUsername: (
    username: string,
    password: string,
    passwordHint: string,
    name?: string
  ) => Promise<void>;
  getPasswordHint: (username: string) => Promise<string>;
  loginAsGuest: (name?: string) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<IUser>) => void;
  incrementContributions: () => void;
  incrementRatings: () => void;
}

const AUTH_USER_KEY = 'seguidor_precios_user_session_v1';

const DEFAULT_USER: IUser = {
  id: 'user-1',
  username: 'david',
  name: 'David Sorteos',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
  passwordHint: 'Mi contraseña habitual',
  isGuest: false,
  contributionsCount: 14,
  ratingsCount: 6,
  level: 'Cazador Experto 🏆',
  createdAt: '2026-08-01T00:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEFAULT_USER);
      }
    } else {
      setUser(DEFAULT_USER);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEFAULT_USER));
    }
    setIsLoading(false);
  }, []);

  const loginWithUsername = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(username, password);
      setUser(loggedUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithUsername = async (
    username: string,
    password: string,
    passwordHint: string,
    name?: string
  ) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(username, password, passwordHint, name);
      setUser(newUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordHint = async (username: string): Promise<string> => {
    return authService.getPasswordHint(username);
  };

  const loginAsGuest = (name: string = 'Cazador Invitado') => {
    const guestUser: IUser = {
      id: `guest-${Date.now()}`,
      username: `invitado_${Math.floor(Math.random() * 1000)}`,
      name: name,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
      isGuest: true,
      contributionsCount: 0,
      ratingsCount: 0,
      level: 'Invitado',
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const updateUserProfile = (updates: Partial<IUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
  };

  const incrementContributions = () => {
    if (!user) return;
    const nextCount = (user.contributionsCount || 0) + 1;
    let level = user.level;
    if (nextCount >= 10) level = 'Cazador Maestro 🌟';
    else if (nextCount >= 5) level = 'Cazador Experto 🏆';
    else if (nextCount >= 2) level = 'Colaborador Frecuente ⚡';

    updateUserProfile({ contributionsCount: nextCount, level });
  };

  const incrementRatings = () => {
    if (!user) return;
    const nextRatings = (user.ratingsCount || 0) + 1;
    updateUserProfile({ ratingsCount: nextRatings });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithUsername,
        registerWithUsername,
        getPasswordHint,
        loginAsGuest,
        logout,
        updateUserProfile,
        incrementContributions,
        incrementRatings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
