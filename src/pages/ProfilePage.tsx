import React, { useState } from 'react';
import {
  User,
  Award,
  Database,
  Cloud,
  RotateCcw,
  Download,
  CheckCircle2,
  LogOut,
  Tag,
  Star,
  HelpCircle,
  Activity,
  Loader2,
  AlertTriangle,
  Sun,
  Moon,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured, testSupabaseConnection, supabaseUrl } from '../services/supabaseClient';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    products,
    stores,
    priceEntries,
    ratings,
    resetDataToDefaults,
    setIsAuthModalOpen,
  } = useAppData();

  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Cloud test state
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
    projectHost: string;
  } | null>(null);

  const isCloudActive = isSupabaseConfigured();

  const handleTestConnection = async () => {
    setIsTestingCloud(true);
    try {
      const res = await testSupabaseConnection();
      setCloudTestResult(res);
    } finally {
      setIsTestingCloud(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('¿Deseas restablecer todos los datos de muestra a su estado original?')) {
      setIsResetting(true);
      await resetDataToDefaults();
      setIsResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleExportData = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      stores,
      products,
      priceEntries,
      ratings,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seguidor_precios_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* 1. User Profile Card */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-slate-800 light:bg-slate-200 flex items-center justify-center text-slate-400">
                <User className="w-10 h-10" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl shadow-md">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black theme-text-primary">
                {user?.name || 'Cazador Anónimo'}
              </h2>
              <span className="bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/20 text-[11px] font-bold px-2 py-0.5 rounded-lg">
                {user?.level || 'Colaborador Activo'}
              </span>
            </div>

            <p className="text-xs theme-text-secondary font-semibold">
              @{user?.username || 'invitado'}
            </p>

            {/* Windows 7 Password hint indicator */}
            {user?.passwordHint && (
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 light:text-amber-700 border border-amber-500/20 text-xs px-2.5 py-1 rounded-xl">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pista de clave: <strong>"{user.passwordHint}"</strong></span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs theme-text-secondary font-semibold">
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-500" />
                <span><strong className="theme-text-primary">{user?.contributionsCount || priceEntries.length}</strong> aportaciones</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span><strong className="theme-text-primary">{user?.ratingsCount || ratings.length}</strong> calificaciones</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cambiar de Usuario</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 theme-bg-card hover:bg-slate-800/40 light:hover:bg-slate-100 theme-text-secondary rounded-2xl text-xs font-semibold transition-colors border theme-border cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Theme & Visual Mode Card */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </div>
          <div>
            <h3 className="text-base font-bold theme-text-primary">
              Tema Visual de la Aplicación
            </h3>
            <p className="text-xs theme-text-secondary">
              Actualmente activo: <strong>{theme === 'dark' ? 'Modo Oscuro (Dark)' : 'Modo Claro (Light)'}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2.5 theme-bg-card hover:bg-slate-800/40 light:hover:bg-slate-100 theme-text-primary rounded-2xl text-xs font-bold transition-all border theme-border shadow-sm cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Activar Modo Claro ☀️</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Activar Modo Oscuro 🌙</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Live Supabase Connection Card (Clean - Without Tutorial Text) */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isCloudActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold theme-text-primary">
                  Estado de Conexión en la Nube (Supabase)
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isCloudActive ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'}`}>
                  {isCloudActive ? '🟢 Configurado en .env' : '💾 Modo Local'}
                </span>
              </div>
              <p className="text-xs theme-text-secondary mt-0.5">
                {supabaseUrl ? `URL: ${supabaseUrl}` : 'Sin archivo .env configurado'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTestingCloud}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            {isTestingCloud ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Probando conexión...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Probar Conexión en Vivo</span>
              </>
            )}
          </button>
        </div>

        {/* Diagnostic Test Result Box */}
        {cloudTestResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in ${
              cloudTestResult.success
                ? 'bg-emerald-950/30 light:bg-emerald-50 border-emerald-500/40 text-emerald-300 light:text-emerald-800'
                : 'bg-rose-950/30 light:bg-rose-50 border-rose-500/40 text-rose-300 light:text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {cloudTestResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              )}
              <span>{cloudTestResult.success ? 'Conexión Exitosa con Supabase' : 'Aviso de Conexión'}</span>
            </div>
            <p className="leading-relaxed">{cloudTestResult.message}</p>
            {cloudTestResult.latencyMs > 0 && (
              <p className="text-[11px] opacity-80 font-medium">
                Latencia del servidor: <strong>{cloudTestResult.latencyMs} ms</strong> • Servidor: {cloudTestResult.projectHost}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 4. Data Management & Backups */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-bold theme-text-primary">
            Administración de Datos Locales
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 theme-bg-card hover:bg-slate-800/40 light:hover:bg-slate-100 theme-text-primary rounded-2xl text-xs font-semibold transition-colors border theme-border cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Exportar Copia de Seguridad JSON</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/30 light:bg-rose-50 hover:bg-rose-900/40 text-rose-400 light:text-rose-700 border border-rose-500/30 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>{isResetting ? 'Restableciendo...' : 'Restablecer Datos de Muestra'}</span>
          </button>
        </div>

        {resetSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 light:text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Datos restablecidos con éxito.</span>
          </div>
        )}
      </div>
    </div>
  );
};
