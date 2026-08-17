import React, { useRef, useState, useEffect } from 'react';
import {
  Search,
  X,
  Flame,
  CheckCircle2,
  Sparkles,
  Coins,
  Crown,
  Layers,
  ArrowDownUp,
  Store as StoreIcon,
  ChevronLeft,
  ChevronRight,
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

  const categoriesRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  const [canScrollCatLeft, setCanScrollCatLeft] = useState(false);
  const [canScrollCatRight, setCanScrollCatRight] = useState(true);

  const [canScrollBadgesLeft, setCanScrollBadgesLeft] = useState(false);
  const [canScrollBadgesRight, setCanScrollBadgesRight] = useState(true);

  // Check scroll positions for categories
  const checkCatScroll = () => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      setCanScrollCatLeft(scrollLeft > 10);
      setCanScrollCatRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Check scroll positions for badges
  const checkBadgesScroll = () => {
    if (badgesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = badgesRef.current;
      setCanScrollBadgesLeft(scrollLeft > 10);
      setCanScrollBadgesRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkCatScroll();
    checkBadgesScroll();
    window.addEventListener('resize', checkCatScroll);
    window.addEventListener('resize', checkBadgesScroll);
    return () => {
      window.removeEventListener('resize', checkCatScroll);
      window.removeEventListener('resize', checkBadgesScroll);
    };
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollBadges = (direction: 'left' | 'right') => {
    if (badgesRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      badgesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle mouse wheel over horizontal lists
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      ref.current.scrollLeft += e.deltaY;
    }
  };

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
            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
              className="appearance-none bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl pl-9 pr-8 py-3.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer h-full shadow-sm"
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
              className="appearance-none bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl pl-9 pr-8 py-3.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer h-full shadow-sm"
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

      {/* 2. Smart Badge and Offer Quick Filter Pills with Scroll Arrows */}
      <div className="relative group/badges">
        {/* Left Arrow Button */}
        {canScrollBadgesLeft && (
          <button
            type="button"
            onClick={() => scrollBadges('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all hover:scale-110"
            title="Ver filtros anteriores"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollBadgesRight && (
          <button
            type="button"
            onClick={() => scrollBadges('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all hover:scale-110"
            title="Ver más filtros"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div
          ref={badgesRef}
          onScroll={checkBadgesScroll}
          onWheel={(e) => handleWheel(e, badgesRef)}
          className="flex items-center gap-2 overflow-x-auto scroll-smooth pb-1 pt-0.5 px-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
          style={{ scrollbarWidth: 'thin' }}
        >
          <button
            type="button"
            onClick={() => setSelectedBadge('all')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedBadge === 'all' && !onlyOffers && !onlyInStock
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos ({filteredProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleBadgeClick('bbb')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedBadge === 'bbb'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105 font-bold'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sello BBB (Bueno, Bonito y Barato)</span>
          </button>

          <button
            type="button"
            onClick={() => handleBadgeClick('cheapest')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedBadge === 'cheapest'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 scale-105 font-bold'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-100'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Más Barato Absoluto</span>
          </button>

          <button
            type="button"
            onClick={() => handleBadgeClick('top_quality')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedBadge === 'top_quality'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 scale-105 font-bold'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30 hover:bg-purple-100'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Top Calidad</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyOffers(!onlyOffers)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              onlyOffers
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-105 font-bold'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 hover:bg-rose-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Ofertas Vigentes ({activeDeals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              onlyInStock
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Solo en Stock</span>
          </button>
        </div>
      </div>

      {/* 3. Horizontal Category Chips with Interactive Scroll Arrows */}
      <div className="relative group/categories">
        {/* Left Scroll Arrow */}
        {canScrollCatLeft && (
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-100 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all hover:scale-110"
            title="Ver categorías anteriores"
          >
            <ChevronLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
        )}

        {/* Right Scroll Arrow */}
        {canScrollCatRight && (
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-100 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all hover:scale-110"
            title="Ver más categorías"
          >
            <ChevronRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
        )}

        <div
          ref={categoriesRef}
          onScroll={checkCatScroll}
          onWheel={(e) => handleWheel(e, categoriesRef)}
          className="flex items-center gap-2 overflow-x-auto scroll-smooth pb-2 pt-0.5 px-1"
          style={{ scrollbarWidth: 'thin' }}
        >
          <button
            type="button"
            onClick={() => handleCategoryClick('Todas')}
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'Todas'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Todas las Categorías
          </button>
          {ALL_PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
