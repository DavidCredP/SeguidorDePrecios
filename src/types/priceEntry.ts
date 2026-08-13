export interface IPriceEntry {
  id: string;
  productId: string;
  storeId: string;
  regularPrice: number;
  offerPrice?: number;
  isOffer: boolean;
  offerEndsAt?: string;       // ISO date string e.g. "2026-08-25"
  inStock: boolean;
  evidencePhotoUrl?: string;  // Shelf tag / receipt / screenshot photo
  notes?: string;             // e.g. "Con tarjeta de lealtad", "Promoción 2x1 equivalente"
  reportedAt: string;         // ISO date string
  reportedByUserId?: string;
  reportedByName?: string;
}

export interface IEnrichedPriceEntry extends IPriceEntry {
  storeName: string;
  storeType: 'physical' | 'digital';
  storeBranchOrAddress?: string;
  storeLogoUrl?: string;
  storeWebsiteUrl?: string;
  effectivePrice: number;     // offerPrice if active offer, else regularPrice
  unitCost: number;           // effectivePrice / unitQuantity
  isOfferActive: boolean;
}
