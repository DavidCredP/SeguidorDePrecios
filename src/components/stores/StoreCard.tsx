import React from 'react';
import { Store as StoreIcon, MapPin, Globe, Tag, Flame, ExternalLink } from 'lucide-react';
import { IStore } from '../../types/store';
import { useAppData } from '../../context/AppDataContext';

interface StoreCardProps {
  store: IStore;
  onSelectStore: (storeId: string) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onSelectStore }) => {
  const { priceEntries } = useAppData();

  const pricesForStore = priceEntries.filter((p) => p.storeId === store.id);
  const activeOffersCount = pricesForStore.filter((p) => p.isOffer).length;

  return (
    <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-14 h-14 bg-slate-950 rounded-2xl p-2 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <StoreIcon className="w-7 h-7 text-slate-600" />
            )}
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
              store.type === 'physical'
                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {store.type === 'physical' ? (
              <>
                <MapPin className="w-3 h-3" />
                <span>Tienda Física</span>
              </>
            ) : (
              <>
                <Globe className="w-3 h-3" />
                <span>Tienda Digital</span>
              </>
            )}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-100">{store.name}</h3>

        {store.branchOrAddress && (
          <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>{store.branchOrAddress}</span>
          </p>
        )}

        {store.shippingNotes && (
          <p className="text-xs text-slate-400 mt-1 bg-slate-950/40 p-2 rounded-xl border border-slate-800/80">
            🚚 {store.shippingNotes}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span><strong>{pricesForStore.length}</strong> precios</span>
          </span>

          {activeOffersCount > 0 && (
            <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/30 px-2 py-0.5 rounded-lg border border-rose-500/20">
              <Flame className="w-3 h-3 text-rose-400" />
              <span>{activeOffersCount} ofertas</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectStore(store.id)}
          className="py-1.5 px-3 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors"
        >
          Ver Precios
        </button>
      </div>
    </div>
  );
};
