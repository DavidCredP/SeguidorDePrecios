import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Coins,
  Crown,
  Star,
  Store,
  ChevronRight,
  TrendingDown,
  Info,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { ALL_PRODUCT_CATEGORIES, ProductCategory } from '../types/product';
import { useAppData } from '../context/AppDataContext';
import { formatCurrency, formatUnitCost } from '../utils/formatters';

export const SmartFinderPage: React.FC = () => {
  const {
    enrichedStats,
    setSelectedProductForDetail,
    setModalTargetProduct,
    setIsRateProductOpen,
    products,
  } = useAppData();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Higiene y Cuidado Personal');

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clasificador Inteligente de Valor</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Comparador BBB vs Más Barato vs Top Calidad
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Compara dentro de cualquier categoría el producto más económico por unidad, el equilibrio ideal <strong>Bueno, Bonito y Barato</strong>, y la opción de <strong>Mayor Calidad</strong> sin sobreprecio.
          </p>
        </div>
      </div>

      {/* Category Tabs Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          Selecciona una categoría para comparar:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {ALL_PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* The 3 Podium Comparison Pillars */}
      {categoryStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. MÁS BARATO ABSOLUTO */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-amber-950/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                      Opción 1: Menor Costo
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-100 leading-tight">
                      Más Barato Absoluto
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥉</span>
              </div>

              {cheapestItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-950 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-800">
                    {cheapestItem.imageUrl ? (
                      <img
                        src={cheapestItem.imageUrl}
                        alt={cheapestItem.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Coins className="w-10 h-10 text-amber-400/40" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">
                      {cheapestItem.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-2">
                      {cheapestItem.productName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{cheapestItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400">Precio mínimo:</span>
                      <span className="text-lg font-black text-amber-400">
                        {formatCurrency(cheapestItem.lowestPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{cheapestItem.lowestPriceStoreName}</span>
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {formatUnitCost(
                          cheapestItem.lowestPrice,
                          cheapestItem.unitQuantity,
                          cheapestItem.unitMeasure
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] text-slate-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
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
              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(cheapestItem)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(cheapestItem)}
                  className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl text-xs font-semibold"
                >
                  Calificar
                </button>
              </div>
            )}
          </div>

          {/* 2. BUENO, BONITO Y BARATO (BBB) - HIGHLIGHT */}
          <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-500/30">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
              RECOMENDADO ⭐
            </div>

            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                      Opción 2: Máximo Valor
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-100 leading-tight">
                      Sello BBB (Equilibrio)
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥈</span>
              </div>

              {bbbItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-950 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-800">
                    {bbbItem.imageUrl ? (
                      <img
                        src={bbbItem.imageUrl}
                        alt={bbbItem.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Sparkles className="w-10 h-10 text-emerald-400/40" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">
                      {bbbItem.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-2">
                      {bbbItem.productName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{bbbItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400">Mejor precio:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-emerald-400">
                          {formatCurrency(bbbItem.lowestPrice)}
                        </span>
                        {bbbItem.savingsVsHighest > 0 && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            -{bbbItem.savingsPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{bbbItem.lowestPriceStoreName}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{bbbItem.averageQuality > 0 ? bbbItem.averageQuality : '4.5'}★</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] text-slate-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
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
              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(bbbItem)}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(bbbItem)}
                  className="py-2 px-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold"
                >
                  Mi Rating
                </button>
              </div>
            )}
          </div>

          {/* 3. MEJOR CALIDAD */}
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-purple-950/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                      Opción 3: Máxima Calidad
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-100 leading-tight">
                      Top Calidad
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥇</span>
              </div>

              {topQualityItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-950 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-800">
                    {topQualityItem.imageUrl ? (
                      <img
                        src={topQualityItem.imageUrl}
                        alt={topQualityItem.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Crown className="w-10 h-10 text-purple-400/40" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">
                      {topQualityItem.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-2">
                      {topQualityItem.productName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{topQualityItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400">Mejor precio:</span>
                      <span className="text-lg font-black text-purple-400">
                        {formatCurrency(topQualityItem.lowestPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{topQualityItem.lowestPriceStoreName}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{topQualityItem.averageQuality}★</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] text-slate-300 bg-purple-950/30 p-2.5 rounded-xl border border-purple-500/20">
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
              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(topQualityItem)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(topQualityItem)}
                  className="py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-xl text-xs font-semibold"
                >
                  Calificar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center space-y-3 max-w-md mx-auto my-12">
          <p className="text-sm font-bold text-slate-300">
            Aún no hay productos con precios registrados en la categoría "{selectedCategory}".
          </p>
        </div>
      )}
    </div>
  );
};
