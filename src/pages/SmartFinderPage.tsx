import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Coins,
  Crown,
  Star,
  Store,
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/30 light:from-purple-100 light:via-white light:to-indigo-50 border border-purple-500/30 light:border-purple-200 p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-500 light:text-purple-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clasificador Inteligente de Valor</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black theme-text-primary tracking-tight">
            Comparador BBB vs Más Barato vs Top Calidad
          </h2>

          <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed font-medium">
            Compara dentro de cualquier categoría el producto más económico por unidad, el equilibrio ideal <strong className="theme-text-primary">Bueno, Bonito y Barato</strong>, y la opción de <strong className="theme-text-primary">Mayor Calidad</strong> sin sobreprecio.
          </p>
        </div>
      </div>

      {/* Category Tabs Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider px-1">
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
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105'
                  : 'theme-bg-card hover:bg-slate-800/40 light:hover:bg-slate-100 theme-text-secondary border theme-border'
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
          <div className="theme-bg-card border border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">
                      Opción 1: Menor Costo
                    </span>
                    <h3 className="text-sm sm:text-base font-black theme-text-primary leading-tight">
                      Más Barato Absoluto
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥉</span>
              </div>

              {cheapestItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-950/40 light:bg-slate-100 rounded-2xl p-2 flex items-center justify-center overflow-hidden border theme-border">
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
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">
                      {cheapestItem.brand}
                    </span>
                    <h4 className="text-sm font-bold theme-text-primary line-clamp-2">
                      {cheapestItem.productName}
                    </h4>
                    <p className="text-xs theme-text-secondary mt-0.5">{cheapestItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 theme-bg-card rounded-2xl border theme-border space-y-1.5 shadow-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] theme-text-secondary">Precio mínimo:</span>
                      <span className="text-lg font-black text-amber-500">
                        {formatCurrency(cheapestItem.lowestPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs theme-text-secondary">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate theme-text-primary font-medium">{cheapestItem.lowestPriceStoreName}</span>
                      </span>
                      <span className="text-[10px] text-amber-600 light:text-amber-700 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {formatUnitCost(
                          cheapestItem.lowestPrice,
                          cheapestItem.unitQuantity,
                          cheapestItem.unitMeasure
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] theme-text-secondary bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    💡 <strong>¿Por qué fue seleccionado?</strong>{' '}
                    {cheapestItem.badgeReasons.cheapest ||
                      'Ofrece el costo por unidad más bajo de toda la categoría.'}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs theme-text-secondary">
                  Sin producto clasificado en esta categoría.
                </div>
              )}
            </div>

            {cheapestItem && (
              <div className="mt-4 pt-3 border-t theme-border flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(cheapestItem)}
                  className="flex-1 py-2 theme-bg-card hover:bg-slate-800/40 light:hover:bg-slate-100 theme-text-primary rounded-xl text-xs font-semibold border theme-border cursor-pointer"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(cheapestItem)}
                  className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 light:text-amber-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Calificar
                </button>
              </div>
            )}
          </div>

          {/* 2. BUENO, BONITO Y BARATO (BBB) - HIGHLIGHT */}
          <div className="theme-bg-card border-2 border-emerald-500/50 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-lg ring-1 ring-emerald-500/20">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
              RECOMENDADO ⭐
            </div>

            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block">
                      Opción 2: Máximo Valor
                    </span>
                    <h3 className="text-sm sm:text-base font-black theme-text-primary leading-tight">
                      Sello BBB (Equilibrio)
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥈</span>
              </div>

              {bbbItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-950/40 light:bg-slate-100 rounded-2xl p-2 flex items-center justify-center overflow-hidden border theme-border">
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
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">
                      {bbbItem.brand}
                    </span>
                    <h4 className="text-sm font-bold theme-text-primary line-clamp-2">
                      {bbbItem.productName}
                    </h4>
                    <p className="text-xs theme-text-secondary mt-0.5">{bbbItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 theme-bg-card rounded-2xl border theme-border space-y-1.5 shadow-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] theme-text-secondary">Mejor precio:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-emerald-500">
                          {formatCurrency(bbbItem.lowestPrice)}
                        </span>
                        {bbbItem.savingsVsHighest > 0 && (
                          <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            -{bbbItem.savingsPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs theme-text-secondary">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate theme-text-primary font-medium">{bbbItem.lowestPriceStoreName}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{bbbItem.averageQuality > 0 ? bbbItem.averageQuality : '4.5'}★</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] theme-text-secondary bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                    🌟 <strong>¿Por qué fue seleccionado?</strong>{' '}
                    {bbbItem.badgeReasons.bbb ||
                      'Alta calificación comunitaria con un precio notablemente accesible.'}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs theme-text-secondary">
                  Sin producto clasificado en esta categoría.
                </div>
              )}
            </div>

            {bbbItem && (
              <div className="mt-4 pt-3 border-t theme-border flex gap-2">
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
                  className="py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 light:text-purple-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Mi Rating
                </button>
              </div>
            )}
          </div>

          {/* 3. MEJOR CALIDAD */}
          <div className="theme-bg-card border border-purple-500/30 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Podium Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-500 flex items-center justify-center font-bold">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-purple-500 uppercase tracking-wider block">
                      Opción 3: Máxima Calidad
                    </span>
                    <h3 className="text-sm sm:text-base font-black theme-text-primary leading-tight">
                      Top Calidad
                    </h3>
                  </div>
                </div>
                <span className="text-xl">🥇</span>
              </div>

              {topQualityItem ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-950/40 light:bg-slate-100 rounded-2xl p-2 flex items-center justify-center overflow-hidden border theme-border">
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
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">
                      {topQualityItem.brand}
                    </span>
                    <h4 className="text-sm font-bold theme-text-primary line-clamp-2">
                      {topQualityItem.productName}
                    </h4>
                    <p className="text-xs theme-text-secondary mt-0.5">{topQualityItem.unit}</p>
                  </div>

                  {/* Price & Store */}
                  <div className="p-3 theme-bg-card rounded-2xl border theme-border space-y-1.5 shadow-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] theme-text-secondary">Mejor precio:</span>
                      <span className="text-lg font-black text-purple-500">
                        {formatCurrency(topQualityItem.lowestPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs theme-text-secondary">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="truncate theme-text-primary font-medium">{topQualityItem.lowestPriceStoreName}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{topQualityItem.averageQuality}★</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason explanation */}
                  <div className="text-[11px] theme-text-secondary bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
                    👑 <strong>¿Por qué fue seleccionado?</strong>{' '}
                    {topQualityItem.badgeReasons.top_quality ||
                      'Máxima puntuación de calidad y durabilidad sin caer en sobreprecio abusivo.'}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs theme-text-secondary">
                  Sin producto clasificado en esta categoría.
                </div>
              )}
            </div>

            {topQualityItem && (
              <div className="mt-4 pt-3 border-t theme-border flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(topQualityItem)}
                  className="flex-1 py-2 theme-bg-card hover:bg-slate-800/40 light:hover:bg-slate-100 theme-text-primary rounded-xl text-xs font-semibold border theme-border cursor-pointer"
                >
                  Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(topQualityItem)}
                  className="py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 light:text-purple-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Calificar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="theme-bg-card border theme-border rounded-3xl p-10 text-center space-y-3 max-w-md mx-auto my-12 shadow-sm">
          <p className="text-sm font-bold theme-text-primary">
            Aún no hay productos con precios registrados en la categoría "{selectedCategory}".
          </p>
        </div>
      )}
    </div>
  );
};
