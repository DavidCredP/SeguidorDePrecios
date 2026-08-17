import React, { useState } from 'react';
import {
  X,
  Star,
  Store,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Camera,
  ThumbsUp,
  Share2,
  TrendingDown,
  Info,
  ArrowRight,
} from 'lucide-react';
import { IProductEnrichedStats } from '../../types/smartBadges';
import { formatCurrency, formatRelativeTime, getDaysLeftUntil } from '../../utils/formatters';
import { SmartBadgeTag } from './SmartBadgeTag';
import { PriceHistoryChart } from './PriceHistoryChart';
import { useAppData } from '../../context/AppDataContext';

interface ProductDetailModalProps {
  stats: IProductEnrichedStats;
  onClose: () => void;
  onSelectStoreFilter?: (storeId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  stats,
  onClose,
  onSelectStoreFilter,
}) => {
  const {
    getProductPrices,
    getProductRatings,
    toggleStockStatus,
    setModalTargetProduct,
    setIsAddPriceOpen,
    setIsRateProductOpen,
    setSelectedStoreId,
    products,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<'prices' | 'chart' | 'reviews'>('prices');
  const [selectedPhotoEvidence, setSelectedPhotoEvidence] = useState<string | null>(null);

  const originalProduct = products.find((p) => p.id === stats.productId);
  const prices = getProductPrices(stats.productId);
  const reviews = getProductRatings(stats.productId);

  const handleAddPrice = () => {
    if (originalProduct) {
      setModalTargetProduct(originalProduct);
      setIsAddPriceOpen(true);
    }
  };

  const handleRate = () => {
    if (originalProduct) {
      setModalTargetProduct(originalProduct);
      setIsRateProductOpen(true);
    }
  };

  const handleStoreClick = (storeId: string) => {
    setSelectedStoreId(storeId);
    if (onSelectStoreFilter) {
      onSelectStoreFilter(storeId);
    }
    onClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${stats.productName} - Seguidor de Precios`,
          text: `Encontré el mejor precio para ${stats.productName} a ${formatCurrency(stats.lowestPrice)} en ${stats.lowestPriceStoreName}!`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex gap-4 items-start">
            {/* Product Thumbnail */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shrink-0 flex items-center justify-center overflow-hidden">
              {stats.imageUrl ? (
                <img
                  src={stats.imageUrl}
                  alt={stats.productName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Store className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {stats.brand}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {stats.category}
                </span>
              </div>

              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                {stats.productName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stats.unit}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {stats.badges.map((b) => (
                  <SmartBadgeTag
                    key={b}
                    badge={b}
                    reason={stats.badgeReasons[b]}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Compartir producto"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlight Banner (Best Price vs Savings) */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider block">
              Mejor Precio Reportado
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(stats.lowestPrice)}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                en{' '}
                <button
                  type="button"
                  onClick={() => {
                    const priceMatch = prices.find((p) => p.effectivePrice === stats.lowestPrice);
                    if (priceMatch) handleStoreClick(priceMatch.storeId);
                  }}
                  className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-dotted cursor-pointer"
                  title="Ver todos los productos en esta tienda"
                >
                  {stats.lowestPriceStoreName} ➔
                </button>
              </span>
            </div>
          </div>

          {stats.savingsVsHighest > 0 && (
            <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 px-3 py-1.5 rounded-2xl text-emerald-700 dark:text-emerald-400 text-xs">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-bold">Ahorras hasta {formatCurrency(stats.savingsVsHighest)}</span>
                <span className="block text-[10px] opacity-80">
                  (-{stats.savingsPercentage}% vs tienda más cara)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-4 sm:px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('prices')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'prices'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Precios por Tienda ({prices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'chart'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Gráfico Comparativo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Opiniones BBB ({reviews.length})
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: PRECIOS DETALLADOS POR TIENDA */}
          {activeTab === 'prices' && (
            <div className="space-y-3">
              {prices.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
                  <Store className="w-12 h-12 mx-auto opacity-50" />
                  <p className="text-sm font-medium">Aún no hay precios registrados para este producto.</p>
                  <button
                    type="button"
                    onClick={handleAddPrice}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Registrar el primer precio
                  </button>
                </div>
              ) : (
                prices.map((price) => {
                  const offerExpiry = getDaysLeftUntil(price.offerEndsAt);
                  const isCheapest = price.effectivePrice === stats.lowestPrice;

                  return (
                    <div
                      key={price.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCheapest
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStoreClick(price.storeId)}
                              className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 text-left cursor-pointer group"
                              title="Ver todos los productos disponibles en esta tienda"
                            >
                              <span>{price.storeName}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                price.storeType === 'physical'
                                  ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                                  : 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                              }`}
                            >
                              {price.storeType === 'physical' ? '📍 Tienda Física' : '🌐 Tienda Digital'}
                            </span>
                            {isCheapest && (
                              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                MEJOR PRECIO
                              </span>
                            )}
                          </div>

                          {price.storeBranchOrAddress && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {price.storeBranchOrAddress}
                            </p>
                          )}

                          {price.notes && (
                            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-500/20 inline-block font-medium">
                              📝 {price.notes}
                            </p>
                          )}
                        </div>

                        {/* Price Numbers & Offer Expiration */}
                        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1">
                          <div className="flex items-baseline gap-2">
                            {price.isOfferActive && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatCurrency(price.regularPrice)}
                              </span>
                            )}
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(price.effectivePrice)}
                            </span>
                          </div>

                          {price.isOfferActive && (
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/30">
                              ⏳ {offerExpiry.text}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer Info & Stock Button */}
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                          <span>Reportado por <strong className="text-slate-900 dark:text-slate-100">{price.reportedByName || 'Comunidad'}</strong></span>
                          <span>•</span>
                          <span>{formatRelativeTime(price.reportedAt)}</span>

                          {/* Evidence Photo Preview */}
                          {price.evidencePhotoUrl && (
                            <button
                              type="button"
                              onClick={() => setSelectedPhotoEvidence(price.evidencePhotoUrl || null)}
                              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20 cursor-pointer"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Ver Foto Etiqueta</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStoreClick(price.storeId)}
                            className="px-2.5 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                            title="Ver todos los productos de esta tienda"
                          >
                            <Store className="w-3 h-3" />
                            <span>Ver catálogo</span>
                          </button>

                          {/* Stock toggle button */}
                          <button
                            type="button"
                            onClick={() => toggleStockStatus(price.id, price.inStock)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              price.inStock
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 hover:bg-rose-100 text-emerald-700 dark:text-emerald-400 hover:text-rose-700 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-rose-100 dark:bg-rose-500/10 hover:bg-emerald-100 text-rose-700 dark:text-rose-400 hover:text-emerald-700 border border-rose-200 dark:border-rose-500/30'
                            }`}
                            title="Haz clic para reportar si se agotó o volvió a haber stock"
                          >
                            {price.inStock ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>En Stock (Marcar agotado)</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                <span>Agotado (Marcar disponible)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: GRÁFICO COMPARATIVO */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
                  Comparativa de Precios en Vivo
                </h4>
                <PriceHistoryChart
                  prices={prices}
                  unitQuantity={stats.unitQuantity}
                  unitMeasure={stats.unitMeasure}
                  onSelectStoreFilter={(storeId) => handleStoreClick(storeId)}
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  Los precios son actualizados colaborativamente por los miembros del grupo. Haz clic en "Ver tienda" o en el nombre de la tienda para explorar todos sus productos.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CALIFICACIONES Y RESEÑAS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Summary Stats Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Calidad Percibida</span>
                  <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1 mt-1">
                    <Star className="w-5 h-5 fill-amber-500" />
                    <span>{stats.averageQuality > 0 ? stats.averageQuality : 'S/C'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Escala de 1 a 5 estrellas</span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Valor BBB</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-1">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <span>{stats.averageValue > 0 ? stats.averageValue : 'S/C'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Relación Calidad-Precio</span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Aprobación</span>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1 mt-1">
                    <ThumbsUp className="w-5 h-5 text-purple-500" />
                    <span>{stats.recommendationRate}%</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Recomiendan comprarlo</span>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Comentarios de Usuarios ({reviews.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleRate}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-bold cursor-pointer"
                  >
                    + Dejar mi opinión
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    Aún no hay opiniones escritas. ¡Sé el primero en calificar este producto!
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                            {r.userName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{r.userName}</span>
                            <span className="text-[10px] text-slate-400 ml-2">
                              {formatRelativeTime(r.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{r.qualityRating}</span>
                        </div>
                      </div>

                      {r.comment && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                          "{r.comment}"
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:px-6 flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={handleAddPrice}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Nuevo Precio / Oferta</span>
          </button>

          <button
            type="button"
            onClick={handleRate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Calificar Calidad & BBB</span>
          </button>
        </div>
      </div>

      {/* Full Photo Evidence Zoom Modal */}
      {selectedPhotoEvidence && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoEvidence(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] p-2 bg-slate-900 rounded-3xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedPhotoEvidence(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950/80 text-white rounded-full hover:bg-rose-600 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhotoEvidence}
              alt="Comprobante de precio"
              className="max-h-[75vh] w-auto mx-auto rounded-2xl object-contain"
            />
            <p className="text-center text-xs text-slate-400 mt-2 font-medium">
              Foto comprobante de etiqueta / ticket de compra
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
