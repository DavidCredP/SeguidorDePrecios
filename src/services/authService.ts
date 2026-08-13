import { IUser, IStoredUserAccount } from '../types/user';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const ACCOUNTS_STORAGE_KEY = 'seguidor_precios_accounts_v1';

const INITIAL_ACCOUNTS: IStoredUserAccount[] = [
  {
    id: 'user-1',
    username: 'david',
    name: 'David Sorteos',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    passwordHint: 'Mi contraseña habitual o número favorito',
    passwordHash: '1234',
    isGuest: false,
    contributionsCount: 14,
    ratingsCount: 6,
    level: 'Cazador Experto 🏆',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'user-2',
    username: 'mariana',
    name: 'Mariana G.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    passwordHint: 'El nombre de mi mascota',
    passwordHash: '1234',
    isGuest: false,
    contributionsCount: 8,
    ratingsCount: 5,
    level: 'Cazador Frecuente ⚡',
    createdAt: '2026-08-02T00:00:00.000Z',
  },
];

class AuthService {
  private getLocalAccounts(): IStoredUserAccount[] {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ACCOUNTS;
    }
  }

  private saveLocalAccounts(accounts: IStoredUserAccount[]) {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }

  /**
   * Register a new user with username, password, and Windows 7 style password hint
   */
  async register(
    username: string,
    password: string,
    passwordHint: string,
    name?: string
  ): Promise<IUser> {
    const cleanUsername = username.trim().toLowerCase();
    const cleanName = name?.trim() || username.trim();
    const cleanHint = passwordHint.trim();

    if (!cleanUsername) throw new Error('El nombre de usuario es obligatorio.');
    if (!password) throw new Error('La contraseña es obligatoria.');
    if (!cleanHint) throw new Error('Debes escribir una pista para recordar tu contraseña.');

    // Check if user already exists in Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: existing } = await supabase
          .from('app_users')
          .select('id')
          .eq('username', cleanUsername)
          .maybeSingle();

        if (existing) {
          throw new Error(`El nombre de usuario "@${cleanUsername}" ya está en uso. Elige otro.`);
        }

        const newUser: IStoredUserAccount = {
          id: `user-${Date.now()}`,
          username: cleanUsername,
          name: cleanName,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
          passwordHint: cleanHint,
          passwordHash: password,
          isGuest: false,
          contributionsCount: 1,
          ratingsCount: 0,
          level: 'Nuevo Cazador',
          createdAt: new Date().toISOString(),
        };

        const { error } = await supabase.from('app_users').insert([
          {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            avatar_url: newUser.avatarUrl,
            password_hint: newUser.passwordHint,
            password_hash: newUser.passwordHash,
            contributions_count: newUser.contributionsCount,
            ratings_count: newUser.ratingsCount,
            level: newUser.level,
          },
        ]);

        if (error) {
          console.warn('Could not insert to Supabase app_users table, saving to local fallback', error);
        } else {
          const { passwordHash: _, ...userWithoutPass } = newUser;
          return userWithoutPass;
        }
      } catch (err: any) {
        if (err.message.includes('ya está en uso')) throw err;
        console.warn('Supabase register error:', err);
      }
    }

    // Local Storage fallback
    const accounts = this.getLocalAccounts();
    if (accounts.some((a) => a.username === cleanUsername)) {
      throw new Error(`El nombre de usuario "@${cleanUsername}" ya está registrado.`);
    }

    const newUser: IStoredUserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      name: cleanName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
      passwordHint: cleanHint,
      passwordHash: password,
      isGuest: false,
      contributionsCount: 1,
      ratingsCount: 0,
      level: 'Nuevo Cazador',
      createdAt: new Date().toISOString(),
    };

    accounts.push(newUser);
    this.saveLocalAccounts(accounts);

    const { passwordHash: _, ...userWithoutPass } = newUser;
    return userWithoutPass;
  }

  /**
   * Log in with username and password
   */
  async login(username: string, password: string): Promise<IUser> {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) {
      throw new Error('Ingresa tu usuario y contraseña.');
    }

    // Try Supabase first
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('app_users')
          .select('*')
          .eq('username', cleanUsername)
          .maybeSingle();

        if (!error && data) {
          if (data.password_hash !== password) {
            throw new Error('Contraseña incorrecta. Haz clic en "¿Olvidaste tu contraseña?" para ver tu pista.');
          }

          return {
            id: data.id,
            username: data.username,
            name: data.name,
            avatarUrl: data.avatar_url,
            passwordHint: data.password_hint,
            isGuest: false,
            contributionsCount: data.contributions_count || 0,
            ratingsCount: data.ratings_count || 0,
            level: data.level || 'Colaborador',
            createdAt: data.created_at,
          };
        }
      } catch (err: any) {
        if (err.message.includes('Contraseña incorrecta')) throw err;
      }
    }

    // Check Local accounts
    const accounts = this.getLocalAccounts();
    const match = accounts.find((a) => a.username === cleanUsername);

    if (!match) {
      throw new Error(`No existe ninguna cuenta con el usuario "@${cleanUsername}".`);
    }

    if (match.passwordHash !== password) {
      throw new Error('Contraseña incorrecta. Haz clic en "¿Olvidaste tu contraseña?" para ver tu pista.');
    }

    const { passwordHash: _, ...userWithoutPass } = match;
    return userWithoutPass;
  }

  /**
   * Get the password hint for a given username (Windows 7 style)
   */
  async getPasswordHint(username: string): Promise<string> {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) throw new Error('Ingresa tu nombre de usuario para buscar tu pista.');

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('app_users')
          .select('password_hint')
          .eq('username', cleanUsername)
          .maybeSingle();

        if (!error && data?.password_hint) {
          return data.password_hint;
        }
      } catch (err) {
        console.warn('Error fetching hint from Supabase:', err);
      }
    }

    const accounts = this.getLocalAccounts();
    const match = accounts.find((a) => a.username === cleanUsername);
    if (match && match.passwordHint) {
      return match.passwordHint;
    }

    throw new Error(`No se encontró ninguna pista para el usuario "@${cleanUsername}".`);
  }
}

export const authService = new AuthService();
