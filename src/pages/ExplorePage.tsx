import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { ProductCard } from '../components/products/ProductCard';
import { PackageOpen, Sparkles, Flame } from 'lucide-react';

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
      {/* Hero Welcome Banner with dynamic theme support */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/90 light:from-emerald-100 light:via-white light:to-teal-50/70 border border-emerald-500/30 light:border-emerald-200 p-6 sm:p-8 shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 light:text-emerald-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Radar Colaborativo de Precios & Ofertas</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black theme-text-primary tracking-tight leading-tight">
            Compara precios locales y digitales al instante.
          </h2>

          <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed font-medium">
            Descubre en qué tienda encuentras el precio base más bajo, aprovecha ofertas antes de que expiren y consulta la clasificación comunitaria <strong className="theme-text-primary">BBB (Bueno, Bonito y Barato)</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <div className="theme-bg-card px-3.5 py-2 rounded-xl border theme-border flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="theme-text-secondary">
                <strong className="theme-text-primary">{products.length}</strong> Productos rastreados
              </span>
            </div>

            {activeDeals.length > 0 && (
              <button
                type="button"
                onClick={onNavigateToDeals}
                className="bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-500 light:text-rose-700 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
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
              className="bg-purple-500/10 hover:bg-purple-500/20 px-3.5 py-2 rounded-xl border border-purple-500/30 text-purple-500 light:text-purple-700 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
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
        <div className="theme-bg-card border theme-border rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/30 light:bg-slate-100 theme-text-secondary flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold theme-text-primary">
              No se encontraron productos con estos filtros
            </h3>
            <p className="text-xs theme-text-secondary mt-1">
              Prueba cambiando la búsqueda o restableciendo los filtros activos.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 theme-bg-card hover:bg-slate-800/40 light:hover:bg-slate-100 theme-text-primary font-semibold rounded-xl text-xs transition-colors border theme-border cursor-pointer"
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
