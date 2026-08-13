import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { ProductCard } from '../components/products/ProductCard';
import { PackageOpen, Sparkles, Flame, PlusCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface ExplorePageProps {
  onNavigateToDeals: () => void;
  onNavigateToSmartFinder: () => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onNavigateToDeals,
  onNavigateToSmartFinder,
}) => {
  const {
    filteredProducts,
    products,
    activeDeals,
    setIsAddProductOpen,
    setIsAddPriceOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedBadge,
    setOnlyOffers,
    setOnlyInStock,
    setSelectedStoreId,
  } = useAppData();

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedBadge('all');
    setOnlyOffers(false);
    setOnlyInStock(false);
    setSelectedStoreId('all');
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Radar Colaborativo de Precios & Ofertas</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight leading-tight">
            Compara precios locales y digitales al instante.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Descubre en qué tienda encuentras el precio base más bajo, aprovecha ofertas antes de que expiren y consulta la clasificación comunitaria <strong>BBB (Bueno, Bonito y Barato)</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300">
                <strong>{products.length}</strong> Productos rastreados
              </span>
            </div>

            {activeDeals.length > 0 && (
              <button
                type="button"
                onClick={onNavigateToDeals}
                className="bg-rose-950/50 hover:bg-rose-900/60 px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>
                  <strong>{activeDeals.length}</strong> Ofertas activas hoy
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateToSmartFinder}
              className="bg-purple-950/50 hover:bg-purple-900/60 px-3.5 py-2 rounded-xl border border-purple-500/30 text-purple-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Ver Comparador BBB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar />

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((stats) => (
            <ProductCard key={stats.productId} stats={stats} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              No se encontraron productos con estos filtros
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Prueba cambiando la búsqueda o restableciendo los filtros activos.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Restablecer Filtros
            </button>
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              + Agregar Nuevo Producto
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
