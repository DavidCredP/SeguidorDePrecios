export type StoreType = 'physical' | 'digital';

export interface IStore {
  id: string;
  name: string;
  type: StoreType;
  branchOrAddress?: string;
  city?: string;
  websiteUrl?: string;
  logoUrl?: string;
  shippingNotes?: string;
  isPopular?: boolean;
  createdAt: string;
  createdBy?: string;
}
