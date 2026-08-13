import React from 'react';
import {
  Tag,
  PlusCircle,
  PackagePlus,
  Store,
  User,
  Sparkles,
  Layers,
  Flame,
  Sun,
  Moon,
  Cloud,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    setIsAddProductOpen,
    setIsAddPriceOpen,
    setIsAuthModalOpen,
    activeDeals,
  } = useAppData();

  const isCloudConnected = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 light:bg-white/90 backdrop-blur-xl border-b border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 light:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Tag className="w-5 h-5 text-emerald-400 -rotate-12" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-slate-100 light:text-slate-900 tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
                  Seguidor<span className="text-emerald-500">Precios</span>
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 light:text-emerald-600 border border-emerald-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded-md hidden sm:inline-block">
                  LOCAL & DIGITAL
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[11px] text-slate-400 light:text-slate-500 hidden sm:block">
                  Cazador de ofertas y comparador BBB
                </p>
                {/* Cloud Status Dot */}
                <span
                  title={isCloudConnected ? 'Conectado a Supabase Cloud' : 'Modo Local Storage'}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                    isCloudConnected
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="hidden md:inline">{isCloudConnected ? 'Nube' : 'Local'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 light:bg-slate-100 p-1.5 rounded-2xl border border-slate-800/80 light:border-slate-200">
            <button
              type="button"
              onClick={() => onTabChange('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'explore'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-950 hover:bg-slate-800/60 light:hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explorar</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('deals')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'deals'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-950 hover:bg-slate-800/60 light:hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Ofertas Vigentes</span>
              {activeDeals.length > 0 && (
                <span className="bg-rose-950 text-rose-300 text-[10px] px-1.5 py-0.5 rounded-full border border-rose-500/30">
                  {activeDeals.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onTabChange('smart_finder')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'smart_finder'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-950 hover:bg-slate-800/60 light:hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Comparador BBB</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('stores')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'stores'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-950 hover:bg-slate-800/60 light:hover:bg-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Tiendas</span>
            </button>
          </nav>

          {/* Right Section: Theme Toggle, Quick Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button (Light / Dark mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 sm:px-2.5 sm:py-2 bg-slate-900 light:bg-slate-100 hover:bg-slate-800 light:hover:bg-slate-200 text-slate-300 light:text-slate-700 border border-slate-800 light:border-slate-300 rounded-2xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              title={theme === 'dark' ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
              <span className="hidden lg:inline text-[11px]">
                {theme === 'dark' ? 'Claro' : 'Oscuro'}
              </span>
            </button>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={() => setIsAddPriceOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Registrar Precio</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="p-2 sm:px-3 sm:py-2 bg-slate-900 light:bg-slate-100 hover:bg-slate-800 light:hover:bg-slate-200 text-slate-200 light:text-slate-800 border border-slate-700/80 light:border-slate-300 rounded-2xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Registrar nuevo producto"
            >
              <PackagePlus className="w-4 h-4 text-emerald-500" />
              <span className="hidden lg:inline">+ Producto</span>
            </button>

            {/* Profile / Account button */}
            <button
              type="button"
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border transition-all ${
                currentTab === 'profile'
                  ? 'bg-purple-950/40 border-purple-500/60 text-purple-300'
                  : 'bg-slate-900 light:bg-slate-100 hover:bg-slate-800 light:hover:bg-slate-200 border-slate-800 light:border-slate-300 text-slate-200 light:text-slate-800'
              }`}
              title="Ver mi perfil y aportaciones"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="text-left hidden xl:block">
                <span className="block text-xs font-bold truncate max-w-[100px] leading-tight">
                  @{user?.username || user?.name || 'Invitado'}
                </span>
                <span className="block text-[10px] text-emerald-400 light:text-emerald-600 font-medium leading-none">
                  {user?.level || 'Colaborador'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
