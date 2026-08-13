export interface IUser {
  id: string;
  username: string;          // Nombre de usuario único (ej. "david", "mariana")
  name: string;              // Nombre visible (ej. "David Sorteos")
  email?: string;
  avatarUrl?: string;
  passwordHint?: string;     // Pista para recordar la contraseña (estilo Windows 7)
  isGuest: boolean;
  contributionsCount: number;
  ratingsCount: number;
  level: string;             // e.g. "Cazador Novato", "Experto en Ahorro", "Leyenda Local"
  createdAt: string;
}

export interface IStoredUserAccount extends IUser {
  passwordHash: string;      // Hash o contraseña guardada
}

export interface AuthSession {
  user: IUser | null;
  isLoading: boolean;
}
