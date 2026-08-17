import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { ProductCard } from '../components/products/ProductCard';
import { PackageOpen, Sparkles, Flame, Store as StoreIcon, X } from 'lucide-react';

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
    stores,
    activeDeals,
    setIsAddProductOpen,
    setSearchQuery,
    setSelectedCategory,
    setSelectedBadge,
    setOnlyOffers,
    setOnlyInStock,
    selectedStoreId,
    setSelectedStoreId,
  } = useAppData();

  const activeStore = stores.find((s) => s.id === selectedStoreId);

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
      {/* Active Store Filter Highlight Banner */}
      {activeStore && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/40 rounded-3xl flex items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Filtrado por Comercio
                </span>
                <span className="text-[11px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                {activeStore.name} {activeStore.branchOrAddress ? `(${activeStore.branchOrAddress})` : ''}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedStoreId('all')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
            <span>Ver todas las tiendas</span>
          </button>
        </div>
      )}

      {/* Hero Welcome Banner (only shown if no store filter is active to keep UI clean) */}
      {!activeStore && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-teal-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-300 dark:border-emerald-500/30 p-6 sm:p-8 shadow-md">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Radar Colaborativo de Precios & Ofertas</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Compara precios locales y digitales al instante.
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Descubre en qué tienda encuentras el precio base más bajo, aprovecha ofertas antes de que expiren y consulta la clasificación comunitaria <strong className="text-slate-900 dark:text-white">BBB (Bueno, Bonito y Barato)</strong>.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">{products.length}</strong> Productos rastreados
                </span>
              </div>

              {activeDeals.length > 0 && (
                <button
                  type="button"
                  onClick={onNavigateToDeals}
                  className="bg-rose-100 dark:bg-rose-950/50 hover:bg-rose-200 dark:hover:bg-rose-900/60 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span>
                    <strong>{activeDeals.length}</strong> Ofertas activas hoy
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={onNavigateToSmartFinder}
                className="bg-purple-100 dark:bg-purple-950/50 hover:bg-purple-200 dark:hover:bg-purple-900/60 px-3.5 py-2 rounded-xl border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Ver Comparador BBB</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No se encontraron productos con estos filtros
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Prueba cambiando la búsqueda o restableciendo los filtros activos.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Restablecer Filtros
            </button>
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              + Agregar Nuevo Producto
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
