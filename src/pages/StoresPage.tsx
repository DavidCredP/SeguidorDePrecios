import React, { useState } from 'react';
import { Store, PlusCircle, Search, MapPin, Globe } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { StoreCard } from '../components/stores/StoreCard';

interface StoresPageProps {
  onSelectStoreFilter: (storeId: string) => void;
}

export const StoresPage: React.FC<StoresPageProps> = ({ onSelectStoreFilter }) => {
  const { stores, setIsAddStoreOpen } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'physical' | 'digital'>('all');

  const filteredStores = stores.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.branchOrAddress && s.branchOrAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">
            <Store className="w-4 h-4" />
            <span>Directorio de Comercios</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            Tiendas Físicas y Digitales Monitoreadas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Registra y consulta supermercados locales, tienditas de la esquina o tiendas online
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddStoreOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Registrar Tienda</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tienda por nombre o sucursal..."
            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Todas ({stores.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('physical')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'physical'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Físicas</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('digital')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'digital'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Digitales</span>
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onSelectStore={(storeId) => onSelectStoreFilter(storeId)}
          />
        ))}
      </div>
    </div>
  );
};
