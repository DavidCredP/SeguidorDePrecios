import { ProductCategory } from './product';

export type SmartBadgeType = 'cheapest' | 'bbb' | 'top_quality';

export interface ISmartBadge {
  type: SmartBadgeType;
  label: string;
  shortLabel: string;
  description: string;
  colorClass: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  iconName: string;
  reason: string;
}

export interface IProductEnrichedStats {
  productId: string;
  productName: string;
  brand: string;
  category: ProductCategory;
  unit: string;
  unitQuantity: number;
  unitMeasure: string;
  imageUrl?: string;
  description?: string;
  
  // Price stats
  lowestPrice: number;
  lowestPriceStoreId: string;
  lowestPriceStoreName: string;
  lowestPriceIsOffer: boolean;
  lowestPriceOfferEndsAt?: string;
  lowestUnitCost: number;       // Precio por unidad mínima (ej. por rollo o por kg)
  
  highestPrice: number;
  averagePrice: number;
  savingsVsHighest: number;     // Ahorro en dinero comparado con la tienda más cara
  savingsPercentage: number;    // % de ahorro
  
  // Stock stats
  isInStockAnywhere: boolean;
  storesWithStockCount: number;
  totalStoresTracked: number;
  
  // Rating stats
  averageQuality: number;       // 1.0 - 5.0
  averageValue: number;         // 1.0 - 5.0
  totalRatings: number;
  recommendationRate: number;   // 0% - 100%
  
  // Active offers
  hasActiveOffer: boolean;
  activeOffersCount: number;
  
  // Badges dynamically computed
  badges: SmartBadgeType[];
  badgeReasons: Record<SmartBadgeType, string>;
  
  // User personal rating if any
  userPersonalQuality?: number;
  userPersonalValue?: number;
}
