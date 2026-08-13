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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';

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
    activeDeals,
  } = useAppData();

  return (
    <header className="sticky top-0 z-40 theme-bg-header backdrop-blur-xl border-b theme-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Clean, Spacious Logo & Brand (No clutter) */}
          <div
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 light:bg-white rounded-[14px] flex items-center justify-center">
                <Tag className="w-5 h-5 text-emerald-500 -rotate-12" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black theme-text-primary tracking-tight leading-tight group-hover:text-emerald-500 transition-colors">
                Seguidor<span className="text-emerald-500">Precios</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl theme-bg-card border theme-border">
            <button
              type="button"
              onClick={() => onTabChange('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'explore'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-800/40 light:hover:bg-slate-100'
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
                  : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-800/40 light:hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Ofertas Vigentes</span>
              {activeDeals.length > 0 && (
                <span className="bg-rose-950 text-rose-300 light:bg-rose-100 light:text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
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
                  : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-800/40 light:hover:bg-slate-100'
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
                  : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-800/40 light:hover:bg-slate-100'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Tiendas</span>
            </button>
          </nav>

          {/* Right Section: Theme Toggle, Quick Actions & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button (Light / Dark mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 sm:px-3 sm:py-2 theme-bg-card hover:bg-slate-800/60 light:hover:bg-slate-100 border theme-border rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title={theme === 'dark' ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline theme-text-secondary text-[11px]">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline theme-text-secondary text-[11px]">Oscuro</span>
                </>
              )}
            </button>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={() => setIsAddPriceOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Registrar Precio</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="p-2 sm:px-3 sm:py-2 theme-bg-card hover:bg-slate-800/60 light:hover:bg-slate-100 border theme-border rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              title="Registrar nuevo producto"
            >
              <PackagePlus className="w-4 h-4 text-emerald-500" />
              <span className="hidden lg:inline theme-text-primary">+ Producto</span>
            </button>

            {/* Profile / Account button */}
            <button
              type="button"
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border transition-all shadow-sm ${
                currentTab === 'profile'
                  ? 'bg-purple-950/40 light:bg-purple-50 border-purple-500 text-purple-300 light:text-purple-700 font-bold'
                  : 'theme-bg-card hover:bg-slate-800/60 light:hover:bg-slate-100 border theme-border'
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
                <div className="w-7 h-7 rounded-full bg-slate-800 light:bg-slate-200 flex items-center justify-center text-slate-300 light:text-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="text-left hidden xl:block">
                <span className="block text-xs font-bold theme-text-primary truncate max-w-[100px] leading-tight">
                  @{user?.username || user?.name || 'Invitado'}
                </span>
                <span className="block text-[10px] text-emerald-500 font-semibold leading-none">
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
