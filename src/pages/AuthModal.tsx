import React, { useState } from 'react';
import {
  X,
  User,
  KeyRound,
  Sparkles,
  Loader2,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

type AuthView = 'login' | 'register' | 'forgot_hint' | 'guest';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const {
    loginWithUsername,
    registerWithUsername,
    getPasswordHint,
    loginAsGuest,
  } = useAuth();

  const [view, setView] = useState<AuthView>('login');

  // Form fields
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  
  // Forgot hint view state
  const [foundHint, setFoundHint] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithUsername(username.trim(), password);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !passwordHint.trim()) {
      setErrorMessage('Por favor llena todos los campos obligatorios (*).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await registerWithUsername(
        username.trim(),
        password,
        passwordHint.trim(),
        name.trim() || undefined
      );
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al registrar la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchHint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Escribe tu nombre de usuario para buscar tu pista.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setFoundHint(null);
    try {
      const hint = await getPasswordHint(username.trim());
      setFoundHint(hint);
    } catch (err: any) {
      setErrorMessage(err.message || 'No se encontró el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsGuest(name.trim() || 'Cazador Invitado');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title & Icon */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            {view === 'register' ? (
              <UserPlus className="w-6 h-6" />
            ) : view === 'forgot_hint' ? (
              <HelpCircle className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>

          <h2 className="text-xl font-black text-slate-100">
            {view === 'login' && 'Iniciar Sesión'}
            {view === 'register' && 'Crear Cuenta Nueva'}
            {view === 'forgot_hint' && 'Recordar Contraseña'}
            {view === 'guest' && 'Modo Invitado Rápido'}
          </h2>
          <p className="text-xs text-slate-400">
            {view === 'login' && 'Accede con tu usuario y contraseña'}
            {view === 'register' && 'Sin correos obligatorios. Incluye tu pista estilo Windows 7'}
            {view === 'forgot_hint' && 'Consulta la pista que registraste al crear tu cuenta'}
            {view === 'guest' && 'Usa la app sin registrar contraseña'}
          </p>
        </div>

        {/* Navigation Tabs */}
        {view !== 'forgot_hint' && (
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setView('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                view === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setView('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                view === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registro
            </button>
            <button
              type="button"
              onClick={() => {
                setView('guest');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                view === 'guest'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Invitado
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* VIEW 1: LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nombre de Usuario *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. david, mariana..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-8 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Contraseña *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot_hint');
                    setErrorMessage(null);
                    setFoundHint(null);
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* VIEW 2: REGISTER */}
        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Usuario Único (sin espacios) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="ej. david123, ana_precios"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-8 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tu Nombre o Apodo Visible
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. David Sorteos, Ana Ruiz"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Contraseña *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe tu contraseña"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Windows 7 Password Hint Field */}
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-emerald-500/30 space-y-1">
              <label className="block text-xs font-bold text-emerald-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pista de contraseña (Estilo Windows 7) *</span>
              </label>
              <p className="text-[10px] text-slate-400">
                Escribe una pista que te recuerde tu clave en caso de olvido (ej. "Nombre de mi mascota", "Año de graduación", o lo que quieras).
              </p>
              <input
                type="text"
                required
                value={passwordHint}
                onChange={(e) => setPasswordHint(e.target.value)}
                placeholder="Ej. Mi primer auto / Fecha especial..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Registrar Cuenta</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* VIEW 3: FORGOT PASSWORD (HINT LOOKUP) */}
        {view === 'forgot_hint' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setView('login');
                setErrorMessage(null);
                setFoundHint(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Iniciar Sesión</span>
            </button>

            <form onSubmit={handleFetchHint} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Ingresa tu Nombre de Usuario
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ej. david, mariana..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-8 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4" />
                    <span>Revelar Mi Pista de Contraseña</span>
                  </>
                )}
              </button>
            </form>

            {foundHint && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tu pista para recordar tu clave:</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-sm font-black text-amber-300 italic">
                    "{foundHint}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs mt-2"
                >
                  Ya la recordé, ir a Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: GUEST MODE */}
        {view === 'guest' && (
          <form onSubmit={handleGuestSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                ¿Cómo te gustaría identificarte?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez (Vecino)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Entrar sin contraseña</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
