import React, { useState, useEffect } from 'react';
import { X, Tag, Plus, Flame, Sparkles, Loader2 } from 'lucide-react';
import { IProduct } from '../../types/product';
import { PhotoUploader } from '../common/PhotoUploader';
import { useAppData } from '../../context/AppDataContext';
import { formatCurrency } from '../../utils/formatters';

interface AddPriceModalProps {
  initialProduct?: IProduct | null;
  onClose: () => void;
}

export const AddPriceModal: React.FC<AddPriceModalProps> = ({ initialProduct, onClose }) => {
  const {
    products,
    stores,
    addPriceEntry,
    setIsAddStoreOpen,
    setIsAddProductOpen,
  } = useAppData();

  const [productId, setProductId] = useState<string>(initialProduct?.id || products[0]?.id || '');
  const [storeId, setStoreId] = useState<string>(stores[0]?.id || '');
  const [regularPrice, setRegularPrice] = useState<string>('');
  const [isOffer, setIsOffer] = useState<boolean>(false);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerEndsAt, setOfferEndsAt] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [inStock, setInStock] = useState<boolean>(true);
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setProductId(initialProduct.id);
    }
  }, [initialProduct]);

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      setErrorMessage('Por favor selecciona un producto.');
      return;
    }
    if (!storeId) {
      setErrorMessage('Por favor selecciona la tienda donde viste el precio.');
      return;
    }

    const regPriceNum = parseFloat(regularPrice);
    if (isNaN(regPriceNum) || regPriceNum <= 0) {
      setErrorMessage('Por favor ingresa un precio regular válido mayor a 0.');
      return;
    }

    let offPriceNum: number | undefined = undefined;
    if (isOffer) {
      offPriceNum = parseFloat(offerPrice);
      if (isNaN(offPriceNum) || offPriceNum <= 0) {
        setErrorMessage('Por favor ingresa el precio de oferta válido.');
        return;
      }
      if (offPriceNum >= regPriceNum) {
        setErrorMessage('El precio de oferta debe ser menor al precio regular.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addPriceEntry({
        productId,
        storeId,
        regularPrice: regPriceNum,
        offerPrice: isOffer ? offPriceNum : undefined,
        isOffer,
        offerEndsAt: isOffer ? offerEndsAt : undefined,
        inStock,
        evidencePhotoUrl: evidencePhotoUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al registrar el precio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Registrar Precio u Oferta
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparte el precio que encontraste en tienda física o digital
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl text-xs text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Product Picker */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Producto *
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsAddProductOpen(true);
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Crear nuevo</span>
              </button>
            </div>

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.brand}) - {p.unit}
                </option>
              ))}
            </select>
          </div>

          {/* Store Picker */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tienda o Sucursal *
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsAddStoreOpen(true);
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Nueva tienda</span>
              </button>
            </div>

            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <optgroup label="Tiendas Físicas">
                {stores
                  .filter((s) => s.type === 'physical')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      📍 {s.name} {s.branchOrAddress ? `(${s.branchOrAddress})` : ''}
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
          </div>

          {/* Regular Price */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Precio Regular Base ($ MXN) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl pl-8 pr-4 py-3 text-base font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Is Offer Switch Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isOffer}
                onChange={(e) => setIsOffer(e.target.checked)}
                className="w-5 h-5 rounded-lg text-rose-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>¿Está en Oferta o Promoción Especial?</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Activa esto si tiene descuento temporal, 2x1 o rebaja con vigencia
                </span>
              </div>
            </label>

            {/* Offer details if checked */}
            {isOffer && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Precio de Oferta ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required={isOffer}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/40 rounded-xl pl-7 pr-3 py-2 text-sm font-bold text-rose-600 dark:text-rose-300 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    ¿Hasta cuándo vence?
                  </label>
                  <input
                    type="date"
                    value={offerEndsAt}
                    onChange={(e) => setOfferEndsAt(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* In Stock Toggle */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-5 h-5 rounded-lg text-emerald-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                  ¿Hay producto disponible en existencia?
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Desmarca si el estante estaba agotado al momento de tu visita
                </span>
              </div>
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Notas / Condiciones de la oferta (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Con tarjeta de cliente frecuente, En estante de liquidación..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Photo Uploader */}
          <PhotoUploader
            label="Foto de la etiqueta de precio / Ticket (Opcional)"
            value={evidencePhotoUrl}
            onChange={setEvidencePhotoUrl}
          />

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publicando precio...</span>
                </>
              ) : (
                <span>Publicar Precio</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
