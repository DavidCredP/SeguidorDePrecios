import React from 'react';
import { Flame, Clock, TrendingDown, Store, AlertCircle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { ProductCard } from '../components/products/ProductCard';
import { formatCurrency } from '../utils/formatters';

export const DealsPage: React.FC = () => {
  const { activeDeals, setIsAddPriceOpen } = useAppData();

  return (
    <div className="space-y-6">
      {/* Deals Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Radar de Ofertas y Promociones Activas</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Ofertas Vigentes en tu Localidad
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              No hay ofertas activas registradas en este momento
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ¿Viste una oferta en el supermercado o en internet? ¡Regístrala para que todos aprovechen!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddPriceOpen(true)}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors shadow-lg shadow-rose-500/20"
          >
            + Registrar Nueva Oferta
          </button>
        </div>
      )}
    </div>
  );
};
