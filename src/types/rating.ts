export type PricePerception = 'overpriced' | 'fair' | 'great_value' | 'bargain';

export interface IRating {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  qualityRating: number;      // 1 to 5 stars (Calidad / Durabilidad / Desempeño)
  valueRating: number;        // 1 to 5 stars (Relación Calidad-Precio)
  pricePerception: PricePerception;
  comment?: string;
  recommended: boolean;
  createdAt: string;
}
