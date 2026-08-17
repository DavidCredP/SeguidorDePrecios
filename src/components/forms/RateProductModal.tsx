import React, { useState } from 'react';
import { X, Star, Sparkles, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { IProduct } from '../../types/product';
import { PricePerception } from '../../types/rating';
import { useAppData } from '../../context/AppDataContext';

interface RateProductModalProps {
  product: IProduct;
  onClose: () => void;
}

export const RateProductModal: React.FC<RateProductModalProps> = ({ product, onClose }) => {
  const { addRating } = useAppData();

  const [qualityRating, setQualityRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);
  const [pricePerception, setPricePerception] = useState<PricePerception>('great_value');
  const [recommended, setRecommended] = useState<boolean>(true);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addRating({
        productId: product.id,
        qualityRating,
        valueRating,
        pricePerception,
        recommended,
        comment: comment.trim() || undefined,
      });

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar la calificación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentVal: number, onChange: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-slate-300 dark:text-slate-600 hover:text-amber-400 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-7 h-7 ${
                star <= currentVal
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 font-black text-amber-500 text-base">{currentVal}.0 / 5.0</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Calificar Producto
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {product.name} ({product.brand})
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl text-xs text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* 1. Quality Rating */}
          <div className="space-y-1.5 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              1. Calidad General del Producto ⭐
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ¿Qué tan bueno te pareció el material, sabor, rendimiento o durabilidad?
            </p>
            {renderStars(qualityRating, setQualityRating)}
          </div>

          {/* 2. Value Rating (BBB) */}
          <div className="space-y-1.5 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              2. Relación Calidad - Precio (Sello BBB) 💎
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ¿Consideras que vale completamente cada centavo pagado?
            </p>
            {renderStars(valueRating, setValueRating)}
          </div>

          {/* 3. Price Perception */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3. ¿Cómo catalogas su nivel de precio?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPricePerception('bargain')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  pricePerception === 'bargain'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                💲 Ganga / Muy Barato
              </button>

              <button
                type="button"
                onClick={() => setPricePerception('great_value')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  pricePerception === 'great_value'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                ⭐ Precio Justo (BBB)
              </button>

              <button
                type="button"
                onClick={() => setPricePerception('overpriced')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  pricePerception === 'overpriced'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                ⚠️ Algo Caro
              </button>
            </div>
          </div>

          {/* 4. Recommendation */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              ¿Recomiendas comprarlo a la comunidad?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRecommended(true)}
                className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  recommended
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Sí</span>
              </button>

              <button
                type="button"
                onClick={() => setRecommended(false)}
                className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  !recommended
                    ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>No</span>
              </button>
            </div>
          </div>

          {/* 5. Comment */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Tu Opinión o Reseña (Opcional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ej. Rinde bastante bien para el precio, aunque la hoja es un poco delgada..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Publicar Calificación</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
