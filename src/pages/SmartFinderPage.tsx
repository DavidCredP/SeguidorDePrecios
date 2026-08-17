import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Coins,
  Crown,
  Star,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ALL_PRODUCT_CATEGORIES, ProductCategory } from '../types/product';
import { useAppData } from '../context/AppDataContext';
import { formatCurrency, formatUnitCost } from '../utils/formatters';

interface SmartFinderPageProps {
  onSelectStoreFilter?: (storeId: string) => void;
}

export const SmartFinderPage: React.FC<SmartFinderPageProps> = ({ onSelectStoreFilter }) => {
  const {
    enrichedStats,
    setSelectedProductForDetail,
    setModalTargetProduct,
    setIsRateProductOpen,
    getProductPrices,
    setSelectedStoreId,
    products,
  } = useAppData();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Higiene y Cuidado Personal');
  const catScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (catScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (catScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      catScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (catScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      catScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Filter products in selected category
  const categoryStats = useMemo(() => {
    return enrichedStats.filter((p) => p.category === selectedCategory && p.lowestPrice > 0);
  }, [enrichedStats, selectedCategory]);

  // Extract spotlight items
  const cheapestItem = useMemo(() => {
    return categoryStats.find((p) => p.badges.includes('cheapest')) || null;
  }, [categoryStats]);

  const bbbItem = useMemo(() => {
    return categoryStats.find((p) => p.badges.includes('bbb')) || null;
  }, [categoryStats]);

  const topQualityItem = useMemo(() => {
    return categoryStats.find((p) => p.badges.includes('top_quality')) || null;
  }, [categoryStats]);

  const handleOpenDetail = (stats: any) => {
    setSelectedProductForDetail(stats);
  };

  const handleRate = (stats: any) => {
    const original = products.find((p) => p.id === stats.productId);
    if (original) {
      setModalTargetProduct(original);
      setIsRateProductOpen(true);
    }
  };

  const handleStoreClick = (productId: string) => {
    const pPrices = getProductPrices(productId);
    if (pPrices.length > 0) {
      const best = pPrices.reduce((prev, curr) => (curr.effectivePrice < prev.effectivePrice ? curr : prev));
      if (best && onSelectStoreFilter) {
        onSelectStoreFilter(best.storeId);
      } else if (best) {
        setSelectedStoreId(best.storeId);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-100 via-white to-indigo-50 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/30 border border-purple-300 dark:border-purple-500/30 p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clasificador Inteligente de Valor</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Comparador BBB vs Más Barato vs Top Calidad
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Compara dentro de cualquier categoría el producto más económico por unidad, el equilibrio ideal <strong className="text-slate-900 dark:text-white">Bueno, Bonito y Barato</strong>, y la opción de <strong className="text-slate-900 dark:text-white">Mayor Calidad</strong> sin sobreprecio.
          </p>
        </div>
      </div>

      {/* Category Tabs Selector with Scroll Arrows & Wheel Scrolling */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          Selecciona una categoría para comparar:
        </label>
        <div className="relative group">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all hover:scale-110"
              title="Ver categorías anteriores"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all hover:scale-110"
              title="Ver más categorías"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={catScrollRef}
            onScroll={checkScroll}
            onWheel={handleWheel}
            className="flex items-center gap-2 overflow-x-auto scroll-smooth pb-2 pt-1 px-1"
            style={{ scrollbarWidth: 'thin' }}
          >
            {ALL_PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The 3 Podium Comparison Pillars */}
      {categoryStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. MÁS BARATO ABSOLUTO */}
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      Opción 1: Menor Costo
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
                      Más Barato Absoluto
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥉</span>
              </div>

              {cheapestItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-950/60 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                    {cheapestItem.imageUrl ? (
                      <img
                        src={cheapestItem.imageUrl}
                        alt={cheapestItem.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Coins className="w-10 h-10 text-amber-500/40" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {cheapestItem.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {cheapestItem.productName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cheapestItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Precio mínimo:</span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(cheapestItem.lowestPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleStoreClick(cheapestItem.productId)}
                        className="flex items-center gap-1 truncate text-[11px] hover:text-emerald-600 dark:hover:text-emerald-400 text-left cursor-pointer group"
                        title="Ver todos los productos de esta tienda"
                      >
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate text-slate-800 dark:text-slate-200 font-medium group-hover:underline">{cheapestItem.lowestPriceStoreName}</span>
                      </button>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {formatUnitCost(
                          cheapestItem.lowestPrice,
                          cheapestItem.unitQuantity,
                          cheapestItem.unitMeasure
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-500/10 p-2.5 rounded-xl border border-amber-200 dark:border-amber-500/20">
                    💡 <strong>¿Por qué fue seleccionado?</strong>{' '}
                    {cheapestItem.badgeReasons.cheapest ||
                      'Ofrece el costo por unidad más bajo de toda la categoría.'}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Sin producto clasificado en esta categoría.
                </div>
              )}
            </div>

            {cheapestItem && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(cheapestItem)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(cheapestItem)}
                  className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Calificar
                </button>
              </div>
            )}
          </div>

          {/* 2. BUENO, BONITO Y BARATO (BBB) - HIGHLIGHT */}
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-lg ring-1 ring-emerald-500/20">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
              RECOMENDADO ⭐
            </div>

            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Opción 2: Máximo Valor
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
                      Sello BBB (Equilibrio)
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥈</span>
              </div>

              {bbbItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-950/60 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                    {bbbItem.imageUrl ? (
                      <img
                        src={bbbItem.imageUrl}
                        alt={bbbItem.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Sparkles className="w-10 h-10 text-emerald-500/40" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {bbbItem.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {bbbItem.productName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{bbbItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Mejor precio:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(bbbItem.lowestPrice)}
                        </span>
                        {bbbItem.savingsVsHighest > 0 && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            -{bbbItem.savingsPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleStoreClick(bbbItem.productId)}
                        className="flex items-center gap-1 truncate text-[11px] hover:text-emerald-600 dark:hover:text-emerald-400 text-left cursor-pointer group"
                        title="Ver todos los productos de esta tienda"
                      >
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate text-slate-800 dark:text-slate-200 font-medium group-hover:underline">{bbbItem.lowestPriceStoreName}</span>
                      </button>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{bbbItem.averageQuality > 0 ? bbbItem.averageQuality : '4.5'}★</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                    🌟 <strong>¿Por qué fue seleccionado?</strong>{' '}
                    {bbbItem.badgeReasons.bbb ||
                      'Alta calificación comunitaria con un precio notablemente accesible.'}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Sin producto clasificado en esta categoría.
                </div>
              )}
            </div>

            {bbbItem && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(bbbItem)}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(bbbItem)}
                  className="py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Mi Rating
                </button>
              </div>
            )}
          </div>

          {/* 3. MEJOR CALIDAD */}
          <div className="bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-500/30 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                      Opción 3: Máxima Calidad
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
                      Top Calidad
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥇</span>
              </div>

              {topQualityItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-950/60 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                    {topQualityItem.imageUrl ? (
                      <img
                        src={topQualityItem.imageUrl}
                        alt={topQualityItem.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Crown className="w-10 h-10 text-purple-500/40" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {topQualityItem.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {topQualityItem.productName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{topQualityItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Mejor precio:</span>
                      <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                        {formatCurrency(topQualityItem.lowestPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleStoreClick(topQualityItem.productId)}
                        className="flex items-center gap-1 truncate text-[11px] hover:text-emerald-600 dark:hover:text-emerald-400 text-left cursor-pointer group"
                        title="Ver todos los productos de esta tienda"
                      >
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate text-slate-800 dark:text-slate-200 font-medium group-hover:underline">{topQualityItem.lowestPriceStoreName}</span>
                      </button>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{topQualityItem.averageQuality}★</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-purple-50 dark:bg-purple-500/10 p-2.5 rounded-xl border border-purple-200 dark:border-purple-500/20">
                    👑 <strong>¿Por qué fue seleccionado?</strong>{' '}
                    {topQualityItem.badgeReasons.top_quality ||
                      'Máxima puntuación de calidad y durabilidad sin caer en sobreprecio abusivo.'}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Sin producto clasificado en esta categoría.
                </div>
              )}
            </div>

            {topQualityItem && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(topQualityItem)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(topQualityItem)}
                  className="py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Calificar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 max-w-md mx-auto my-12 shadow-sm">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Aún no hay productos con precios registrados en la categoría "{selectedCategory}".
          </p>
        </div>
      )}
    </div>
  );
};
