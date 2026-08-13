-- ====================================================================
-- SEGUIDOR DE PRECIOS - SCHEMA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- 100% Gratuito en la nube con Row Level Security (RLS) y Storage
-- ====================================================================

-- 1. TABLA: USUARIOS PERSONALIZADOS (app_users con pista de contraseña)
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    password_hint TEXT,
    password_hash TEXT NOT NULL,
    contributions_count INTEGER DEFAULT 0,
    ratings_count INTEGER DEFAULT 0,
    level TEXT DEFAULT 'Nuevo Cazador',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA: TIENDAS (stores)
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('physical', 'digital')),
    branch_or_address TEXT,
    city TEXT DEFAULT 'Local',
    website_url TEXT,
    logo_url TEXT,
    shipping_notes TEXT,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by TEXT
);

-- 3. TABLA: PRODUCTOS (products)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_quantity NUMERIC DEFAULT 1 NOT NULL,
    unit_measure TEXT DEFAULT 'piezas' NOT NULL,
    barcode TEXT,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by TEXT
);

-- 4. TABLA: PRECIOS REGISTRADOS (price_entries)
CREATE TABLE IF NOT EXISTS public.price_entries (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    regular_price NUMERIC NOT NULL,
    offer_price NUMERIC,
    is_offer BOOLEAN DEFAULT false NOT NULL,
    offer_ends_at DATE,
    in_stock BOOLEAN DEFAULT true NOT NULL,
    evidence_photo_url TEXT,
    notes TEXT,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reported_by_user_id TEXT,
    reported_by_name TEXT
);

-- 5. TABLA: CALIFICACIONES Y RESEÑAS BBB (ratings)
CREATE TABLE IF NOT EXISTS public.ratings (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    quality_rating NUMERIC NOT NULL CHECK (quality_rating >= 1 AND quality_rating <= 5),
    value_rating NUMERIC NOT NULL CHECK (value_rating >= 1 AND value_rating <= 5),
    price_perception TEXT NOT NULL CHECK (price_perception IN ('overpriced', 'fair', 'great_value', 'bargain')),
    comment TEXT,
    recommended BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ÍNDICES DE RENDIMIENTO PARA BÚSQUEDA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_app_users_username ON public.app_users(username);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON public.price_entries(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_store_id ON public.price_entries(store_id);
CREATE INDEX IF NOT EXISTS idx_ratings_product_id ON public.ratings(product_id);

-- 7. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura
CREATE POLICY "Permitir lectura publica de app_users" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de tiendas" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de precios" ON public.price_entries FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de calificaciones" ON public.ratings FOR SELECT USING (true);

-- Políticas de inserción y actualización
CREATE POLICY "Permitir registro de usuarios" ON public.app_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion de usuarios" ON public.app_users FOR UPDATE USING (true);
CREATE POLICY "Permitir insercion de tiendas" ON public.stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir insercion de productos" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir insercion de precios" ON public.price_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion de stock de precios" ON public.price_entries FOR UPDATE USING (true);
CREATE POLICY "Permitir insercion de calificaciones" ON public.ratings FOR INSERT WITH CHECK (true);
