import { IProduct } from '../types/product';
import { IPriceEntry } from '../types/priceEntry';
import { IRating } from '../types/rating';
import { IStore } from '../types/store';
import { IProductEnrichedStats, SmartBadgeType, ISmartBadge } from '../types/smartBadges';

export const SMART_BADGES_METADATA: Record<SmartBadgeType, Omit<ISmartBadge, 'reason'>> = {
  cheapest: {
    type: 'cheapest',
    label: 'Más Barato Absoluto',
    shortLabel: 'Más Barato',
    description: 'El menor costo por unidad o por porción en su categoría.',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bgGradient: 'from-amber-600/30 to-amber-950/40',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-300',
    iconName: 'Coins',
  },
  bbb: {
    type: 'bbb',
    label: 'Bueno, Bonito y Barato (BBB)',
    shortLabel: 'Sello BBB ⭐',
    description: 'Excelente calidad aprobada por la comunidad a un precio sumamente accesible.',
    colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bgGradient: 'from-emerald-600/30 to-emerald-950/40',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-300',
    iconName: 'Sparkles',
  },
  top_quality: {
    type: 'top_quality',
    label: 'Mejor Calidad',
    shortLabel: 'Top Calidad 👑',
    description: 'Máxima satisfacción, desempeño y durabilidad sin caer en sobreprecio injustificado.',
    colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    bgGradient: 'from-purple-600/30 to-purple-950/40',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-300',
    iconName: 'Crown',
  },
};

export const calculateProductStats = (
  products: IProduct[],
  prices: IPriceEntry[],
  ratings: IRating[],
  stores: IStore[],
  currentUserId?: string
): IProductEnrichedStats[] => {
  const storeMap = new Map<string, IStore>(stores.map((s) => [s.id, s]));

  // 1. Group prices and ratings by product
  const pricesByProduct = new Map<string, IPriceEntry[]>();
  for (const price of prices) {
    const list = pricesByProduct.get(price.productId) || [];
    list.push(price);
    pricesByProduct.set(price.productId, list);
  }

  const ratingsByProduct = new Map<string, IRating[]>();
  for (const rating of ratings) {
    const list = ratingsByProduct.get(rating.productId) || [];
    list.push(rating);
    ratingsByProduct.set(rating.productId, list);
  }

  // 2. Precompute per-product basic stats
  const initialStats: IProductEnrichedStats[] = products.map((product) => {
    const prodPrices = pricesByProduct.get(product.id) || [];
    const prodRatings = ratingsByProduct.get(product.id) || [];

    // Filter valid prices
    let lowestPrice = Infinity;
    let lowestPriceStoreId = '';
    let lowestPriceStoreName = 'Sin registro';
    let lowestPriceIsOffer = false;
    let lowestPriceOfferEndsAt: string | undefined = undefined;
    let highestPrice = 0;
    let sumPrice = 0;
    let validPricesCount = 0;
    let inStockCount = 0;
    let activeOffersCount = 0;

    const now = new Date().getTime();

    for (const p of prodPrices) {
      const isOfferActive =
        p.isOffer &&
        p.offerPrice !== undefined &&
        p.offerPrice > 0 &&
        (!p.offerEndsAt || new Date(p.offerEndsAt).getTime() >= now);

      const effectivePrice = isOfferActive && p.offerPrice ? p.offerPrice : p.regularPrice;

      if (effectivePrice > 0) {
        sumPrice += effectivePrice;
        validPricesCount++;

        if (effectivePrice < lowestPrice) {
          lowestPrice = effectivePrice;
          lowestPriceStoreId = p.storeId;
          const store = storeMap.get(p.storeId);
          lowestPriceStoreName = store ? store.name : 'Tienda no especificada';
          lowestPriceIsOffer = isOfferActive;
          lowestPriceOfferEndsAt = p.offerEndsAt;
        }

        if (effectivePrice > highestPrice) {
          highestPrice = effectivePrice;
        }
      }

      if (p.inStock) {
        inStockCount++;
      }

      if (isOfferActive) {
        activeOffersCount++;
      }
    }

    if (lowestPrice === Infinity) lowestPrice = 0;
    const averagePrice = validPricesCount > 0 ? sumPrice / validPricesCount : 0;
    const savingsVsHighest = highestPrice > lowestPrice ? highestPrice - lowestPrice : 0;
    const savingsPercentage = highestPrice > 0 ? Math.round((savingsVsHighest / highestPrice) * 100) : 0;
    const unitQty = product.unitQuantity > 0 ? product.unitQuantity : 1;
    const lowestUnitCost = lowestPrice > 0 ? lowestPrice / unitQty : 0;

    // Ratings calculation
    let sumQuality = 0;
    let sumValue = 0;
    let recommendedCount = 0;
    let userPersonalQuality: number | undefined;
    let userPersonalValue: number | undefined;

    for (const r of prodRatings) {
      sumQuality += r.qualityRating;
      sumValue += r.valueRating;
      if (r.recommended) recommendedCount++;

      if (currentUserId && r.userId === currentUserId) {
        userPersonalQuality = r.qualityRating;
        userPersonalValue = r.valueRating;
      }
    }

    const totalRatings = prodRatings.length;
    const averageQuality = totalRatings > 0 ? Number((sumQuality / totalRatings).toFixed(1)) : 0;
    const averageValue = totalRatings > 0 ? Number((sumValue / totalRatings).toFixed(1)) : 0;
    const recommendationRate = totalRatings > 0 ? Math.round((recommendedCount / totalRatings) * 100) : 0;

    return {
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      unit: product.unit,
      unitQuantity: product.unitQuantity,
      unitMeasure: product.unitMeasure,
      imageUrl: product.imageUrl,
      description: product.description,

      lowestPrice,
      lowestPriceStoreId,
      lowestPriceStoreName,
      lowestPriceIsOffer,
      lowestPriceOfferEndsAt,
      lowestUnitCost,

      highestPrice,
      averagePrice,
      savingsVsHighest,
      savingsPercentage,

      isInStockAnywhere: inStockCount > 0,
      storesWithStockCount: inStockCount,
      totalStoresTracked: prodPrices.length,

      averageQuality,
      averageValue,
      totalRatings,
      recommendationRate,

      hasActiveOffer: activeOffersCount > 0,
      activeOffersCount,

      badges: [],
      badgeReasons: {
        cheapest: '',
        bbb: '',
        top_quality: '',
      },

      userPersonalQuality,
      userPersonalValue,
    };
  });

  // 3. Compute Smart Badges per Category
  const byCategory = new Map<string, IProductEnrichedStats[]>();
  for (const stat of initialStats) {
    const list = byCategory.get(stat.category) || [];
    list.push(stat);
    byCategory.set(stat.category, list);
  }

  for (const [, categoryStats] of byCategory.entries()) {
    if (categoryStats.length === 0) continue;

    // Filter items with valid prices
    const pricedItems = categoryStats.filter((s) => s.lowestUnitCost > 0);
    if (pricedItems.length === 0) continue;

    // A. Cheapest Absolute (Lowest unit cost)
    let minUnitCost = Infinity;
    let cheapestItem: IProductEnrichedStats | null = null;

    for (const item of pricedItems) {
      if (item.lowestUnitCost < minUnitCost) {
        minUnitCost = item.lowestUnitCost;
        cheapestItem = item;
      }
    }

    if (cheapestItem) {
      cheapestItem.badges.push('cheapest');
      cheapestItem.badgeReasons.cheapest = `Menor costo por ${cheapestItem.unitMeasure} ($${cheapestItem.lowestUnitCost.toFixed(2)}/${cheapestItem.unitMeasure}) en ${cheapestItem.lowestPriceStoreName}`;
    }

    // Category unit price benchmark
    const avgUnitCost =
      pricedItems.reduce((acc, curr) => acc + curr.lowestUnitCost, 0) / pricedItems.length;

    // B. Top Quality (Highest quality score >= 4.3 in category)
    const ratedItems = categoryStats.filter((s) => s.totalRatings > 0);
    if (ratedItems.length > 0) {
      const maxQuality = Math.max(...ratedItems.map((s) => s.averageQuality));
      if (maxQuality >= 4.2) {
        const topQualItems = ratedItems.filter((s) => s.averageQuality === maxQuality);
        for (const topItem of topQualItems) {
          if (!topItem.badges.includes('top_quality')) {
            topItem.badges.push('top_quality');
            topItem.badgeReasons.top_quality = `Máxima calificación de calidad de la comunidad (${topItem.averageQuality}★) y ${topItem.recommendationRate}% de aprobación`;
          }
        }
      }
    }

    // C. BBB (Bueno, Bonito y Barato)
    // Quality >= 3.8, Value >= 4.0 or (Quality >= 4.0 and unit cost <= avgUnitCost * 1.15)
    for (const item of pricedItems) {
      const effectiveQuality = item.userPersonalQuality || item.averageQuality;
      const effectiveValue = item.userPersonalValue || item.averageValue;

      const isHighQuality = effectiveQuality >= 3.8 || (item.totalRatings === 0 && item.savingsPercentage >= 25);
      const isGoodPrice = item.lowestUnitCost <= avgUnitCost * 1.1 || effectiveValue >= 4.0 || item.hasActiveOffer;
      const isHighlyRecommended = item.totalRatings === 0 || item.recommendationRate >= 65;

      if (isHighQuality && isGoodPrice && isHighlyRecommended) {
        if (!item.badges.includes('bbb')) {
          item.badges.push('bbb');
          const reason =
            item.totalRatings > 0
              ? `Gran calidad (${effectiveQuality}★) con precio altamente competitivo vs el promedio de la categoría`
              : `Excelente precio en promoción con un ahorro de hasta ${item.savingsPercentage}%`;
          item.badgeReasons.bbb = reason;
        }
      }
    }
  }

  return initialStats;
};
