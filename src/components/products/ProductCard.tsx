import React from 'react';
import {
  Star,
  Store,
  Tag,
  TrendingDown,
  Clock,
  PlusCircle,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { IProductEnrichedStats } from '../../types/smartBadges';
import { formatCurrency, getDaysLeftUntil, formatUnitCost } from '../../utils/formatters';
import { SmartBadgeTag } from './SmartBadgeTag';
import { useAppData } from '../../context/AppDataContext';

interface ProductCardProps {
  stats: IProductEnrichedStats;
}

export const ProductCard: React.FC<ProductCardProps> = ({ stats }) => {
  const {
    setSelectedProductForDetail,
    setModalTargetProduct,
    setIsAddPriceOpen,
    setIsRateProductOpen,
    products,
  } = useAppData();

  const originalProduct = products.find((p) => p.id === stats.productId);
  const offerExpiry = getDaysLeftUntil(stats.lowestPriceOfferEndsAt);

  const handleOpenDetail = () => {
    setSelectedProductForDetail(stats);
  };

  const handleAddPrice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (originalProduct) {
      setModalTargetProduct(originalProduct);
      setIsAddPriceOpen(true);
    }
  };

  const handleRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (originalProduct) {
      setModalTargetProduct(originalProduct);
      setIsRateProductOpen(true);
    }
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="group relative theme-bg-card hover:bg-slate-800/30 light:hover:bg-white border theme-border hover:border-emerald-500/50 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer shadow-sm"
    >
      {/* Top Section: Badges & Image */}
      <div>
        <div className="relative aspect-4/3 w-full bg-slate-950/40 light:bg-slate-100 rounded-2xl overflow-hidden mb-3.5 border theme-border flex items-center justify-center">
          {stats.imageUrl ? (
            <img
              src={stats.imageUrl}
              alt={stats.productName}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Tag className="w-10 h-10 mb-1" />
              <span className="text-[11px]">Sin imagen</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {stats.badges.map((badge) => (
              <SmartBadgeTag
                key={badge}
                badge={badge}
                reason={stats.badgeReasons[badge]}
                size="sm"
              />
            ))}
          </div>

          {/* Active Offer Banner */}
          {stats.lowestPriceIsOffer && (
            <div className="absolute bottom-2 right-2 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
              <Clock className="w-3 h-3" />
              <span>{offerExpiry.text}</span>
            </div>
          )}
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium theme-text-secondary mb-1">
          <span className="uppercase tracking-wider text-emerald-500 font-bold truncate">
            {stats.brand}
          </span>
          <span className="truncate bg-slate-800/40 light:bg-slate-100 px-2 py-0.5 rounded-md theme-text-secondary">
            {stats.category}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm sm:text-base font-bold theme-text-primary line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors">
          {stats.productName}
        </h3>

        {/* Unit Quantity subtitle */}
        <p className="text-xs theme-text-secondary mt-0.5">{stats.unit}</p>

        {/* Community Ratings Bar */}
        <div className="flex items-center gap-2 mt-2.5 text-xs theme-text-secondary">
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-lg border border-amber-500/20 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{stats.averageQuality > 0 ? stats.averageQuality : 'S/C'}</span>
          </div>

          {stats.totalRatings > 0 ? (
            <span className="text-[11px] theme-text-secondary">
              ({stats.totalRatings} {stats.totalRatings === 1 ? 'reseña' : 'reseñas'}) •{' '}
              <span className="text-emerald-500 font-medium">{stats.recommendationRate}% recomiendan</span>
            </span>
          ) : (
            <span className="text-[11px] opacity-70 italic">Sé el primero en calificar</span>
          )}
        </div>
      </div>

      {/* Bottom Section: Price Spotlight & Actions */}
      <div className="mt-4 pt-3.5 border-t theme-border">
        {stats.lowestPrice > 0 ? (
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className="text-[11px] theme-text-secondary font-medium block">
                  Mejor precio encontrado:
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-500 tracking-tight">
                    {formatCurrency(stats.lowestPrice)}
                  </span>
                  {stats.unitQuantity > 1 && (
                    <span className="text-[11px] theme-text-secondary font-medium">
                      ({formatUnitCost(stats.lowestPrice, stats.unitQuantity, stats.unitMeasure)})
                    </span>
                  )}
                </div>
              </div>

              {/* Savings pill */}
              {stats.savingsVsHighest > 0 && (
                <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold px-2 py-1 rounded-xl">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>-{stats.savingsPercentage}%</span>
                </div>
              )}
            </div>

            {/* Lowest Price Store Name & Availability */}
            <div className="flex items-center justify-between gap-2 mt-1.5 text-xs theme-text-secondary">
              <div className="flex items-center gap-1.5 truncate">
                <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold theme-text-primary truncate">
                  {stats.lowestPriceStoreName}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {stats.isInStockAnywhere ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>En stock</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>Agotado</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-xs theme-text-secondary">
            <span>Sin precios reportados todavía</span>
          </div>
        )}

        {/* Card Action Buttons */}
        <div className="grid grid-cols-3 gap-1.5 mt-3.5">
          <button
            type="button"
            onClick={handleOpenDetail}
            className="flex items-center justify-center gap-1 py-2 px-2 theme-bg-card hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-semibold transition-all border theme-border"
            title="Comparar precios entre tiendas"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Comparar</span>
            <span className="sm:hidden">Ver</span>
          </button>

          <button
            type="button"
            onClick={handleAddPrice}
            className="flex items-center justify-center gap-1 py-2 px-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-xl text-xs font-semibold transition-all border border-emerald-500/30"
            title="Registrar nuevo precio u oferta encontrada"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Precio</span>
          </button>

          <button
            type="button"
            onClick={handleRate}
            className="flex items-center justify-center gap-1 py-2 px-2 bg-purple-500/10 hover:bg-purple-500 text-purple-500 hover:text-white rounded-xl text-xs font-semibold transition-all border border-purple-500/30"
            title="Calificar calidad y valor de este producto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Opinar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
