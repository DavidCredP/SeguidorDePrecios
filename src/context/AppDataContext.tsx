import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { IStore } from '../types/store';
import { IProduct, ProductCategory } from '../types/product';
import { IPriceEntry, IEnrichedPriceEntry } from '../types/priceEntry';
import { IRating } from '../types/rating';
import { IProductEnrichedStats, SmartBadgeType } from '../types/smartBadges';
import { dataService } from '../services/dataService';
import { calculateProductStats } from '../services/smartBadgeEngine';
import { useAuth } from './AuthContext';

export type SortOption =
  | 'cheapest'
  | 'quality'
  | 'savings'
  | 'rating_count'
  | 'recent'
  | 'alphabetical';

interface AppDataContextType {
  // Data
  stores: IStore[];
  products: IProduct[];
  priceEntries: IPriceEntry[];
  ratings: IRating[];
  enrichedStats: IProductEnrichedStats[];
  isLoading: boolean;
  isCloudConnected: boolean;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory | 'Todas';
  setSelectedCategory: (cat: ProductCategory | 'Todas') => void;
  selectedBadge: SmartBadgeType | 'all';
  setSelectedBadge: (badge: SmartBadgeType | 'all') => void;
  onlyOffers: boolean;
  setOnlyOffers: (val: boolean) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  selectedStoreId: string | 'all';
  setSelectedStoreId: (storeId: string | 'all') => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // Filtered Products
  filteredProducts: IProductEnrichedStats[];
  activeDeals: IProductEnrichedStats[];

  // Modals & Navigation
  selectedProductForDetail: IProductEnrichedStats | null;
  setSelectedProductForDetail: (prod: IProductEnrichedStats | null) => void;
  modalTargetProduct: IProduct | null;
  setModalTargetProduct: (prod: IProduct | null) => void;
  isAddProductOpen: boolean;
  setIsAddProductOpen: (open: boolean) => void;
  isAddPriceOpen: boolean;
  setIsAddPriceOpen: (open: boolean) => void;
  isAddStoreOpen: boolean;
  setIsAddStoreOpen: (open: boolean) => void;
  isRateProductOpen: boolean;
  setIsRateProductOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Actions
  addProduct: (productData: Omit<IProduct, 'id' | 'createdAt'>) => Promise<IProduct>;
  addPriceEntry: (priceData: Omit<IPriceEntry, 'id' | 'reportedAt'>) => Promise<IPriceEntry>;
  addStore: (storeData: Omit<IStore, 'id' | 'createdAt'>) => Promise<IStore>;
  addRating: (ratingData: Omit<IRating, 'id' | 'createdAt' | 'userId' | 'userName'>) => Promise<IRating>;
  toggleStockStatus: (priceId: string, currentStatus: boolean) => Promise<void>;
  getProductPrices: (productId: string) => IEnrichedPriceEntry[];
  getProductRatings: (productId: string) => IRating[];
  resetDataToDefaults: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, incrementContributions, incrementRatings } = useAuth();

  const [stores, setStores] = useState<IStore[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [priceEntries, setPriceEntries] = useState<IPriceEntry[]>([]);
  const [ratings, setRatings] = useState<IRating[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudConnected] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Todas'>('Todas');
  const [selectedBadge, setSelectedBadge] = useState<SmartBadgeType | 'all'>('all');
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('cheapest');

  // Modals state
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<IProductEnrichedStats | null>(null);
  const [modalTargetProduct, setModalTargetProduct] = useState<IProduct | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [isAddPriceOpen, setIsAddPriceOpen] = useState<boolean>(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState<boolean>(false);
  const [isRateProductOpen, setIsRateProductOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Initial Load
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedStores, fetchedProducts, fetchedPrices, fetchedRatings] = await Promise.all([
        dataService.getStores(),
        dataService.getProducts(),
        dataService.getPriceEntries(),
        dataService.getRatings(),
      ]);

      setStores(fetchedStores);
      setProducts(fetchedProducts);
      setPriceEntries(fetchedPrices);
      setRatings(fetchedRatings);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Enriched Stats
  const enrichedStats = useMemo(() => {
    return calculateProductStats(products, priceEntries, ratings, stores, user?.id);
  }, [products, priceEntries, ratings, stores, user?.id]);

  // Keep detail modal updated if product data changes
  useEffect(() => {
    if (selectedProductForDetail) {
      const updated = enrichedStats.find((s) => s.productId === selectedProductForDetail.productId);
      if (updated) setSelectedProductForDetail(updated);
    }
  }, [enrichedStats, selectedProductForDetail]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return enrichedStats
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = item.productName.toLowerCase().includes(q);
          const matchesBrand = item.brand.toLowerCase().includes(q);
          const matchesCat = item.category.toLowerCase().includes(q);
          const matchesStore = item.lowestPriceStoreName.toLowerCase().includes(q);
          if (!matchesName && !matchesBrand && !matchesCat && !matchesStore) return false;
        }

        // Category filter
        if (selectedCategory !== 'Todas' && item.category !== selectedCategory) {
          return false;
        }

        // Badge filter
        if (selectedBadge !== 'all') {
          if (!item.badges.includes(selectedBadge)) return false;
        }

        // Only offers filter
        if (onlyOffers && !item.hasActiveOffer) {
          return false;
        }

        // Only in stock filter
        if (onlyInStock && !item.isInStockAnywhere) {
          return false;
        }

        // Selected Store filter
        if (selectedStoreId !== 'all') {
          const pricesForThis = priceEntries.filter(
            (p) => p.productId === item.productId && p.storeId === selectedStoreId
          );
          if (pricesForThis.length === 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'cheapest':
            if (a.lowestPrice === 0) return 1;
            if (b.lowestPrice === 0) return -1;
            return a.lowestPrice - b.lowestPrice;
          case 'quality':
            return b.averageQuality - a.averageQuality;
          case 'savings':
            return b.savingsPercentage - a.savingsPercentage;
          case 'rating_count':
            return b.totalRatings - a.totalRatings;
          case 'alphabetical':
            return a.productName.localeCompare(b.productName);
          case 'recent':
          default:
            return 0;
        }
      });
  }, [
    enrichedStats,
    searchQuery,
    selectedCategory,
    selectedBadge,
    onlyOffers,
    onlyInStock,
    selectedStoreId,
    sortBy,
    priceEntries,
  ]);

  // Active Deals
  const activeDeals = useMemo(() => {
    return enrichedStats
      .filter((item) => item.hasActiveOffer)
      .sort((a, b) => b.savingsPercentage - a.savingsPercentage);
  }, [enrichedStats]);

  // Actions
  const addProduct = async (productData: Omit<IProduct, 'id' | 'createdAt'>): Promise<IProduct> => {
    const newProduct: IProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: user?.id,
    };
    const saved = await dataService.saveProduct(newProduct);
    setProducts((prev) => [saved, ...prev]);
    incrementContributions();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });

    return saved;
  };

  const addPriceEntry = async (priceData: Omit<IPriceEntry, 'id' | 'reportedAt'>): Promise<IPriceEntry> => {
    const newEntry: IPriceEntry = {
      ...priceData,
      id: `price-${Date.now()}`,
      reportedAt: new Date().toISOString(),
      reportedByUserId: user?.id,
      reportedByName: user?.name || 'Cazador Comunitario',
    };
    const saved = await dataService.savePriceEntry(newEntry);
    setPriceEntries((prev) => [saved, ...prev]);
    incrementContributions();

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10b981', '#14b8a6', '#f59e0b'],
    });

    return saved;
  };

  const addStore = async (storeData: Omit<IStore, 'id' | 'createdAt'>): Promise<IStore> => {
    const newStore: IStore = {
      ...storeData,
      id: `store-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: user?.id,
    };
    const saved = await dataService.saveStore(newStore);
    setStores((prev) => [saved, ...prev]);
    incrementContributions();
    return saved;
  };

  const addRating = async (
    ratingData: Omit<IRating, 'id' | 'createdAt' | 'userId' | 'userName'>
  ): Promise<IRating> => {
    const newRating: IRating = {
      ...ratingData,
      id: `rat-${Date.now()}`,
      userId: user?.id || 'guest',
      userName: user?.name || 'Usuario Anónimo',
      userAvatar: user?.avatarUrl,
      createdAt: new Date().toISOString(),
    };
    const saved = await dataService.saveRating(newRating);
    setRatings((prev) => {
      const idx = prev.findIndex((r) => r.productId === saved.productId && r.userId === saved.userId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    incrementRatings();

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#ec4899', '#f59e0b'],
    });

    return saved;
  };

  const toggleStockStatus = async (priceId: string, currentStatus: boolean): Promise<void> => {
    const nextStatus = !currentStatus;
    await dataService.updatePriceStock(priceId, nextStatus);
    setPriceEntries((prev) =>
      prev.map((p) => (p.id === priceId ? { ...p, inStock: nextStatus } : p))
    );
  };

  const getProductPrices = (productId: string): IEnrichedPriceEntry[] => {
    const storeMap = new Map<string, IStore>(stores.map((s) => [s.id, s]));
    const now = new Date().getTime();
    const product = products.find((p) => p.id === productId);
    const unitQty = product && product.unitQuantity > 0 ? product.unitQuantity : 1;

    return priceEntries
      .filter((p) => p.productId === productId)
      .map((p) => {
        const store = storeMap.get(p.storeId);
        const isOfferActive =
          p.isOffer &&
          p.offerPrice !== undefined &&
          p.offerPrice > 0 &&
          (!p.offerEndsAt || new Date(p.offerEndsAt).getTime() >= now);

        const effectivePrice = isOfferActive && p.offerPrice ? p.offerPrice : p.regularPrice;
        const unitCost = effectivePrice > 0 ? effectivePrice / unitQty : 0;

        return {
          ...p,
          storeName: store ? store.name : 'Tienda desconocida',
          storeType: store ? store.type : 'physical',
          storeBranchOrAddress: store?.branchOrAddress,
          storeLogoUrl: store?.logoUrl,
          storeWebsiteUrl: store?.websiteUrl,
          effectivePrice,
          unitCost,
          isOfferActive,
        };
      })
      .sort((a, b) => a.effectivePrice - b.effectivePrice);
  };

  const getProductRatings = (productId: string): IRating[] => {
    return ratings
      .filter((r) => r.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const resetDataToDefaults = async () => {
    await dataService.resetToSampleData();
    await loadData();
  };

  const refreshAllData = async () => {
    await loadData();
  };

  return (
    <AppDataContext.Provider
      value={{
        stores,
        products,
        priceEntries,
        ratings,
        enrichedStats,
        isLoading,
        isCloudConnected,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBadge,
        setSelectedBadge,
        onlyOffers,
        setOnlyOffers,
        onlyInStock,
        setOnlyInStock,
        selectedStoreId,
        setSelectedStoreId,
        sortBy,
        setSortBy,

        filteredProducts,
        activeDeals,

        selectedProductForDetail,
        setSelectedProductForDetail,
        modalTargetProduct,
        setModalTargetProduct,
        isAddProductOpen,
        setIsAddProductOpen,
        isAddPriceOpen,
        setIsAddPriceOpen,
        isAddStoreOpen,
        setIsAddStoreOpen,
        isRateProductOpen,
        setIsRateProductOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,

        addProduct,
        addPriceEntry,
        addStore,
        addRating,
        toggleStockStatus,
        getProductPrices,
        getProductRatings,
        resetDataToDefaults,
        refreshAllData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
