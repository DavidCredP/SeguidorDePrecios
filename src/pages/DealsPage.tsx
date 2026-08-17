import React from 'react';
import { Flame } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { ProductCard } from '../components/products/ProductCard';

export const DealsPage: React.FC = () => {
  const { activeDeals, setIsAddPriceOpen } = useAppData();

  return (
    <div className="space-y-6">
      {/* Deals Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-100 via-white to-amber-50 dark:from-rose-950/40 dark:via-slate-900/80 dark:to-amber-950/30 border border-rose-200 dark:border-rose-500/30 p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-bold shadow-sm">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Radar de Ofertas y Promociones Activas</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Ofertas Vigentes en tu Localidad
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Todos los productos con precio rebajado o promoción temporal antes de su fecha de vencimiento. Aprovéchalas antes de que terminen.
          </p>
        </div>
      </div>

      {/* Grid of Active Deals */}
      {activeDeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {activeDeals.map((stats) => (
            <ProductCard key={stats.productId} stats={stats} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-500/20">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No hay ofertas activas registradas en este momento
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ¿Viste una oferta en el supermercado o en internet? ¡Regístrala para que todos aprovechen!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddPriceOpen(true)}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
          >
            + Registrar Nueva Oferta
          </button>
        </div>
      )}
    </div>
  );
};
