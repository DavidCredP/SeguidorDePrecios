import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Sparkles,
  Coins,
  Crown,
  Layers,
  ArrowDownUp,
  Store as StoreIcon,
} from 'lucide-react';
import { ALL_PRODUCT_CATEGORIES, ProductCategory } from '../../types/product';
import { SmartBadgeType } from '../../types/smartBadges';
import { useAppData, SortOption } from '../../context/AppDataContext';

export const SearchFilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBadge,
    setSelectedBadge,
    onlyOffers,
    setOnlyOffers,
    onlyInStock,
    setOnlyInStock,
    selectedStoreId,
    setSelectedStoreId,
    sortBy,
    setSortBy,
    stores,
    filteredProducts,
    activeDeals,
  } = useAppData();

  const handleCategoryClick = (cat: ProductCategory | 'Todas') => {
    setSelectedCategory(cat);
  };

  const handleBadgeClick = (badge: SmartBadgeType | 'all') => {
    if (selectedBadge === badge) {
      setSelectedBadge('all');
    } else {
      setSelectedBadge(badge);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* 1. Main Search Bar & Quick Action */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto, marca, tienda o categoría (ej. Papel, Nutrioli, Aurrera)..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Store & Sort Controls */}
        <div className="flex gap-2">
          {/* Store Selector */}
          <div className="relative">
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="appearance-none bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-9 pr-8 py-3.5 text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer h-full"
            >
              <option value="all">Todas las Tiendas</option>
              <optgroup label="Tiendas Físicas">
                {stores
                  .filter((s) => s.type === 'physical')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      📍 {s.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Tiendas Digitales">
                {stores
                  .filter((s) => s.type === 'digital')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      🌐 {s.name}
                    </option>
                  ))}
              </optgroup>
            </select>
            <StoreIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-9 pr-8 py-3.5 text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer h-full"
            >
              <option value="cheapest">💲 Más barato</option>
              <option value="quality">⭐ Mejor calificado</option>
              <option value="savings">🔥 Mayor ahorro %</option>
              <option value="rating_count">👥 Más valorados</option>
              <option value="alphabetical">🔤 Nombre A-Z</option>
            </select>
            <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Smart Badge and Offer Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
        <button
          type="button"
          onClick={() => setSelectedBadge('all')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedBadge === 'all' && !onlyOffers && !onlyInStock
              ? 'bg-slate-200 text-slate-900 shadow-md scale-105'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Todos ({filteredProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleBadgeClick('bbb')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedBadge === 'bbb'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105 font-bold'
              : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sello BBB (Bueno, Bonito y Barato)</span>
        </button>

        <button
          type="button"
          onClick={() => handleBadgeClick('cheapest')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedBadge === 'cheapest'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 scale-105 font-bold'
              : 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Más Barato Absoluto</span>
        </button>

        <button
          type="button"
          onClick={() => handleBadgeClick('top_quality')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedBadge === 'top_quality'
              ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/25 scale-105 font-bold'
              : 'bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/50'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Top Calidad</span>
        </button>

        <button
          type="button"
          onClick={() => setOnlyOffers(!onlyOffers)}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            onlyOffers
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-105 font-bold'
              : 'bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Ofertas Vigentes ({activeDeals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setOnlyInStock(!onlyInStock)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            onlyInStock
              ? 'bg-sky-500 text-slate-950 font-semibold'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Solo en Stock</span>
        </button>
      </div>

      {/* 3. Horizontal Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => handleCategoryClick('Todas')}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            selectedCategory === 'Todas'
              ? 'bg-emerald-600 text-white font-semibold shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Todas las Categorías
        </button>
        {ALL_PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryClick(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
