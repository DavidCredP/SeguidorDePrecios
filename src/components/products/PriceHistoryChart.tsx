import React from 'react';
import { IEnrichedPriceEntry } from '../../types/priceEntry';
import { formatCurrency, formatUnitCost } from '../../utils/formatters';
import { Store, Flame, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface PriceHistoryChartProps {
  prices: IEnrichedPriceEntry[];
  unitQuantity: number;
  unitMeasure: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  prices,
  unitQuantity,
  unitMeasure,
}) => {
  if (prices.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-slate-400">
        No hay registros de precios para graficar.
      </div>
    );
  }

  const validPrices = prices.filter((p) => p.effectivePrice > 0);
  const lowestPrice = Math.min(...validPrices.map((p) => p.effectivePrice));
  const highestPrice = Math.max(...validPrices.map((p) => p.effectivePrice));

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
        <span>Tienda / Sucursal</span>
        <span>Comparativa de Precio</span>
      </div>

      <div className="space-y-3">
        {prices.map((item, idx) => {
          const isLowest = item.effectivePrice === lowestPrice;
          const diffVsLowest = item.effectivePrice - lowestPrice;
          const diffPercent = lowestPrice > 0 ? Math.round((diffVsLowest / lowestPrice) * 100) : 0;
          
          // Width calculation for relative bar: min 30%, max 100%
          const barWidthPercent =
            highestPrice > 0
              ? Math.max(30, Math.round((item.effectivePrice / highestPrice) * 100))
              : 100;

          return (
            <div
              key={item.id || idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                isLowest
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isLowest ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isLowest ? '1°' : `${idx + 1}°`}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-100 truncate">
                        {item.storeName}
                      </span>
                      {item.storeType === 'digital' && item.storeWebsiteUrl && (
                        <a
                          href={item.storeWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 inline-flex items-center"
                          title="Visitar tienda digital"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    {item.storeBranchOrAddress && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.storeBranchOrAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end gap-1.5">
                    {item.isOfferActive && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatCurrency(item.regularPrice)}
                      </span>
                    )}
                    <span
                      className={`text-base font-black tracking-tight ${
                        isLowest ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {formatCurrency(item.effectivePrice)}
                    </span>
                  </div>

                  {unitQuantity > 1 && (
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {formatUnitCost(item.effectivePrice, unitQuantity, unitMeasure)}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar Visualizing Difference */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden flex items-center">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLowest
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-slate-600 to-slate-500'
                    }`}
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <div className="flex items-center gap-2">
                    {item.isOfferActive && (
                      <span className="flex items-center gap-1 text-rose-400 font-semibold">
                        <Flame className="w-3 h-3" />
                        <span>Oferta activa</span>
                      </span>
                    )}

                    {item.inStock ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>En existencia</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        <span>Agotado</span>
                      </span>
                    )}
                  </div>

                  <div>
                    {isLowest ? (
                      <span className="text-emerald-400 font-bold">¡Opción más barata! 🏆</span>
                    ) : (
                      <span className="text-slate-400 font-medium">
                        +{formatCurrency(diffVsLowest)} (+{diffPercent}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
