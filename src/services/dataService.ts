import { IStore } from '../types/store';
import { IProduct } from '../types/product';
import { IPriceEntry } from '../types/priceEntry';
import { IRating } from '../types/rating';
import {
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_PRICE_ENTRIES,
  INITIAL_RATINGS,
} from '../utils/sampleData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  STORES: 'seguidor_precios_stores_v1',
  PRODUCTS: 'seguidor_precios_products_v1',
  PRICE_ENTRIES: 'seguidor_precios_prices_v1',
  RATINGS: 'seguidor_precios_ratings_v1',
};

class DataService {
  // STORES
  async getStores(): Promise<IStore[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('stores').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            name: d.name,
            type: d.type,
            branchOrAddress: d.branch_or_address,
            city: d.city,
            websiteUrl: d.website_url,
            logoUrl: d.logo_url,
            shippingNotes: d.shipping_notes,
            isPopular: d.is_popular,
            createdAt: d.created_at,
            createdBy: d.created_by,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for stores, using local storage fallback', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.STORES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(INITIAL_STORES));
      return INITIAL_STORES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_STORES;
    }
  }

  async saveStore(store: IStore): Promise<IStore> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('stores').insert([
          {
            id: store.id,
            name: store.name,
            type: store.type,
            branch_or_address: store.branchOrAddress,
            city: store.city,
            website_url: store.websiteUrl,
            logo_url: store.logoUrl,
            shipping_notes: store.shippingNotes,
            is_popular: store.isPopular,
            created_by: store.createdBy,
          },
        ]);
      } catch (err) {
        console.error('Failed to sync store to Supabase:', err);
      }
    }

    const stores = await this.getStores();
    const existingIndex = stores.findIndex((s) => s.id === store.id);
    if (existingIndex >= 0) {
      stores[existingIndex] = store;
    } else {
      stores.unshift(store);
    }
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
    return store;
  }

  // PRODUCTS
  async getProducts(): Promise<IProduct[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            name: d.name,
            brand: d.brand,
            category: d.category,
            unit: d.unit,
            unitQuantity: Number(d.unit_quantity),
            unitMeasure: d.unit_measure,
            barcode: d.barcode,
            imageUrl: d.image_url,
            description: d.description,
            createdAt: d.created_at,
            createdBy: d.created_by,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for products, using local storage fallback', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  async saveProduct(product: IProduct): Promise<IProduct> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').insert([
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            unit: product.unit,
            unit_quantity: product.unitQuantity,
            unit_measure: product.unitMeasure,
            barcode: product.barcode,
            image_url: product.imageUrl,
            description: product.description,
            created_by: product.createdBy,
          },
        ]);
      } catch (err) {
        console.error('Failed to sync product to Supabase:', err);
      }
    }

    const products = await this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  }

  // PRICE ENTRIES
  async getPriceEntries(): Promise<IPriceEntry[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('price_entries').select('*').order('reported_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            productId: d.product_id,
            storeId: d.store_id,
            regularPrice: Number(d.regular_price),
            offerPrice: d.offer_price !== null ? Number(d.offer_price) : undefined,
            isOffer: Boolean(d.is_offer),
            offerEndsAt: d.offer_ends_at,
            inStock: Boolean(d.in_stock),
            evidencePhotoUrl: d.evidence_photo_url,
            notes: d.notes,
            reportedAt: d.reported_at,
            reportedByUserId: d.reported_by_user_id,
            reportedByName: d.reported_by_name,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for prices, using local storage fallback', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.PRICE_ENTRIES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PRICE_ENTRIES, JSON.stringify(INITIAL_PRICE_ENTRIES));
      return INITIAL_PRICE_ENTRIES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PRICE_ENTRIES;
    }
  }

  async savePriceEntry(entry: IPriceEntry): Promise<IPriceEntry> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('price_entries').insert([
          {
            id: entry.id,
            product_id: entry.productId,
            store_id: entry.storeId,
            regular_price: entry.regularPrice,
            offer_price: entry.offerPrice,
            is_offer: entry.isOffer,
            offer_ends_at: entry.offerEndsAt,
            in_stock: entry.inStock,
            evidence_photo_url: entry.evidencePhotoUrl,
            notes: entry.notes,
            reported_by_user_id: entry.reportedByUserId,
            reported_by_name: entry.reportedByName,
          },
        ]);
      } catch (err) {
        console.error('Failed to sync price entry to Supabase:', err);
      }
    }

    const prices = await this.getPriceEntries();
    const existingIndex = prices.findIndex((p) => p.id === entry.id);
    if (existingIndex >= 0) {
      prices[existingIndex] = entry;
    } else {
      prices.unshift(entry);
    }
    localStorage.setItem(STORAGE_KEYS.PRICE_ENTRIES, JSON.stringify(prices));
    return entry;
  }

  async updatePriceStock(priceId: string, inStock: boolean): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('price_entries').update({ in_stock: inStock }).eq('id', priceId);
      } catch (err) {
        console.error('Failed to update stock in Supabase:', err);
      }
    }

    const prices = await this.getPriceEntries();
    const target = prices.find((p) => p.id === priceId);
    if (target) {
      target.inStock = inStock;
      localStorage.setItem(STORAGE_KEYS.PRICE_ENTRIES, JSON.stringify(prices));
    }
  }

  // RATINGS
  async getRatings(): Promise<IRating[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('ratings').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            productId: d.product_id,
            userId: d.user_id,
            userName: d.user_name,
            userAvatar: d.user_avatar,
            qualityRating: Number(d.quality_rating),
            valueRating: Number(d.value_rating),
            pricePerception: d.price_perception,
            comment: d.comment,
            recommended: Boolean(d.recommended),
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for ratings, using local storage fallback', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.RATINGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(INITIAL_RATINGS));
      return INITIAL_RATINGS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_RATINGS;
    }
  }

  async saveRating(rating: IRating): Promise<IRating> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('ratings').insert([
          {
            id: rating.id,
            product_id: rating.productId,
            user_id: rating.userId,
            user_name: rating.userName,
            user_avatar: rating.userAvatar,
            quality_rating: rating.qualityRating,
            value_rating: rating.valueRating,
            price_perception: rating.pricePerception,
            comment: rating.comment,
            recommended: rating.recommended,
          },
        ]);
      } catch (err) {
        console.error('Failed to sync rating to Supabase:', err);
      }
    }

    const ratings = await this.getRatings();
    // If user already rated this product, replace it
    const existingIndex = ratings.findIndex(
      (r) => r.productId === rating.productId && r.userId === rating.userId
    );
    if (existingIndex >= 0) {
      ratings[existingIndex] = rating;
    } else {
      ratings.unshift(rating);
    }
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
    return rating;
  }

  // RESET
  async resetToSampleData(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(INITIAL_STORES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.PRICE_ENTRIES, JSON.stringify(INITIAL_PRICE_ENTRIES));
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(INITIAL_RATINGS));
  }
}

export const dataService = new DataService();
