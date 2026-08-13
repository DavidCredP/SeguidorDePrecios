export type ProductCategory =
  | 'Abarrotes y Despensa'
  | 'Limpieza del Hogar'
  | 'Higiene y Cuidado Personal'
  | 'Bebidas y Lácteos'
  | 'Frutas y Verduras'
  | 'Carnes y Salchichonería'
  | 'Mascotas'
  | 'Farmacia y Salud'
  | 'Tecnología y Hogar'
  | 'Otros';

export const ALL_PRODUCT_CATEGORIES: ProductCategory[] = [
  'Abarrotes y Despensa',
  'Limpieza del Hogar',
  'Higiene y Cuidado Personal',
  'Bebidas y Lácteos',
  'Frutas y Verduras',
  'Carnes y Salchichonería',
  'Mascotas',
  'Farmacia y Salud',
  'Tecnología y Hogar',
  'Otros',
];

export interface IProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  unit: string;               // Ej: "Paquete de 12 rollos", "Bolsa de 1 kg", "Botella 3 Litros"
  unitQuantity: number;       // Ej: 12, 1, 3
  unitMeasure: string;        // Ej: "rollos", "kg", "g", "L", "ml", "piezas"
  barcode?: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
}
