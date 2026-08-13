import React from 'react';
import { Layers, Flame, Sparkles, Store, User, PlusCircle } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { activeDeals, setIsAddPriceOpen } = useAppData();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        
        {/* Explorar */}
        <button
          type="button"
          onClick={() => onTabChange('explore')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            currentTab === 'explore' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Explorar</span>
        </button>

        {/* Ofertas */}
        <button
          type="button"
          onClick={() => onTabChange('deals')}
          className={`relative flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            currentTab === 'deals' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-5 h-5" />
          {activeDeals.length > 0 && (
            <span className="absolute top-1 right-2.5 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              {activeDeals.length}
            </span>
          )}
          <span className="text-[10px] tracking-tight">Ofertas</span>
        </button>

        {/* Floating Add Price Action */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsAddPriceOpen(true)}
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform"
            title="Registrar precio encontrado"
          >
            <PlusCircle className="w-7 h-7" />
          </button>
        </div>

        {/* Comparador BBB */}
        <button
          type="button"
          onClick={() => onTabChange('smart_finder')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            currentTab === 'smart_finder' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">BBB Radar</span>
        </button>

        {/* Tiendas */}
        <button
          type="button"
          onClick={() => onTabChange('stores')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            currentTab === 'stores' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Tiendas</span>
        </button>
      </div>
    </div>
  );
};
