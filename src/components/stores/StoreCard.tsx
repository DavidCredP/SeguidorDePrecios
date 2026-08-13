import React from 'react';
import { Store as StoreIcon, MapPin, Globe, Tag, Flame } from 'lucide-react';
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
    <div className="theme-bg-card hover:bg-slate-800/30 light:hover:bg-slate-50/50 border theme-border hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-14 h-14 bg-slate-950/40 light:bg-slate-100 rounded-2xl p-2 border theme-border flex items-center justify-center overflow-hidden shrink-0">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <StoreIcon className="w-7 h-7 theme-text-secondary opacity-60" />
            )}
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
              store.type === 'physical'
                ? 'bg-blue-500/10 text-blue-600 light:text-blue-700 border border-blue-500/20'
                : 'bg-indigo-500/10 text-indigo-600 light:text-indigo-700 border border-indigo-500/20'
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

        <h3 className="text-base font-bold theme-text-primary">{store.name}</h3>

        {store.branchOrAddress && (
          <p className="text-xs theme-text-secondary mt-1 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 opacity-60 shrink-0 mt-0.5" />
            <span>{store.branchOrAddress}</span>
          </p>
        )}

        {store.shippingNotes && (
          <p className="text-xs theme-text-secondary mt-1 bg-slate-950/30 light:bg-slate-100 p-2 rounded-xl border theme-border">
            🚚 {store.shippingNotes}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t theme-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs theme-text-secondary">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-emerald-500" />
            <span><strong className="theme-text-primary">{pricesForStore.length}</strong> precios</span>
          </span>

          {activeOffersCount > 0 && (
            <span className="flex items-center gap-1 text-rose-500 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>{activeOffersCount} ofertas</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectStore(store.id)}
          className="py-1.5 px-3 theme-bg-card hover:bg-emerald-600 hover:text-white theme-text-primary rounded-xl text-xs font-semibold transition-colors border theme-border cursor-pointer shadow-sm"
        >
          Ver Precios
        </button>
      </div>
    </div>
  );
};
