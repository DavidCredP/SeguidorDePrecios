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
            className="p-1 text-slate-600 hover:text-amber-400 focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 ${
                star <= currentVal
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-700'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 font-black text-amber-400 text-base">{currentVal}.0 / 5.0</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950/90 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100">
                Calificar Producto
              </h2>
              <p className="text-xs text-slate-400 line-clamp-1">
                {product.name} ({product.brand})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* 1. Quality Rating */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                1. Calidad, Durabilidad y Rendimiento
              </label>
              <p className="text-[11px] text-slate-400">
                ¿Qué tan bueno es el producto en sí? (Suavidad, resistencia, sabor, eficacia)
              </p>
            </div>
            {renderStars(qualityRating, setQualityRating)}
          </div>

          {/* 2. Value Rating (BBB) */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                2. Relación Calidad-Precio (Factor BBB)
              </label>
              <p className="text-[11px] text-slate-400">
                ¿Vale lo que cuesta? ¿Es justo o sobresaliente por su costo?
              </p>
            </div>
            {renderStars(valueRating, setValueRating)}
          </div>

          {/* 3. Price Perception */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              3. ¿Cómo consideras el precio general de este producto?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bargain', label: '🎉 Una Ganga', desc: 'Súper barato para lo que es' },
                { id: 'great_value', label: '⭐ Gran Valor', desc: 'Excelente relación BBB' },
                { id: 'fair', label: '⚖️ Precio Justo', desc: 'Cuesta lo que debe costar' },
                { id: 'overpriced', label: '💸 Sobreprecio', desc: 'Muy caro para lo que ofrece' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPricePerception(item.id as PricePerception)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    pricePerception === item.id
                      ? 'bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/30'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-100">{item.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Recommendation Switch */}
          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              ¿Recomiendas comprar este producto?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRecommended(true)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  recommended
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Sí</span>
              </button>
              <button
                type="button"
                onClick={() => setRecommended(false)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !recommended
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>No</span>
              </button>
            </div>
          </div>

          {/* 5. Written Review */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Tu Reseña u Opinión (Opcional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explica por qué lo recomiendas, cuánto tiempo te dura, etc."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
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
