# 🛒 Seguidor de Precios & Radar de Ofertas BBB

Aplicación web colaborativa y responsiva (PC y Celular / PWA) para encontrar el precio base más económico de cualquier producto en tiendas físicas y digitales de tu localidad, rastrear ofertas vigentes antes de que venzan, evaluar la relación calidad-precio y clasificar automáticamente los productos con los sellos:

- 🥉 **Más Barato Absoluto**: El menor costo por unidad (por rollo, por kg, por litro).
- 🥈 **Sello BBB (Bueno, Bonito y Barato)**: El equilibrio perfecto entre gran calidad recomendada por la comunidad ($\ge 3.8\bigstar$) y un precio accesible.
- 🥇 **Top Calidad**: Máxima satisfacción y durabilidad sin caer en sobreprecios abusivos.

---

## 📱 Características Principales

1. **Directorio de Tiendas Físicas y Digitales**:
   - Registra supermercados, tienditas de la esquina, farmacias o sitios web (Amazon, Mercado Libre, etc.).
   - Consulta el número de precios y ofertas activas por tienda.

2. **Registro de Precios y Ofertas en Tiempo Real**:
   - Registra precio regular base, precio de oferta con fecha de fin de vigencia.
   - Sube fotos de etiquetas de anaquel o tickets de compra directamente desde la cámara de tu celular.
   - Marca productos como "Agotado" o "En Stock" sin perder el registro del precio histórico.

3. **Comparador Inteligente por Categoría (BBB Radar)**:
   - Pantalla interactiva que coloca en podio lado a lado: *El Más Barato*, *El Campeón BBB*, y *El de Mayor Calidad*.
   - Permite ingresar calificaciones personales que recalculan al instante tu visión personalizada y enriquecen las estadísticas comunitarias.

4. **Radar de Ofertas Vigentes**:
   - Pestaña exclusiva con cuenta regresiva ("¡Vence hoy!", "Quedan 3 días") y cálculo del porcentaje de ahorro frente a la tienda más cara.

5. **100% Gratuito en la Nube**:
   - Funciona de forma autónoma con **LocalStorage / IndexedDB** precargado con datos de muestra realistas.
   - Listo para sincronizar con **Supabase Cloud (PostgreSQL + Auth + Storage gratuito)** en 1 clic.

---

## 🚀 Inicio Rápido Local

### Requisitos:
- Node.js (v18 o superior)
- npm

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Iniciar servidor de desarrollo:
```bash
npm run dev
```
Abre en tu navegador (o celular en la misma red Wi-Fi): `http://localhost:5173`.

### 3. Compilar para producción:
```bash
npm run build
```

---

## ☁️ Conexión con Supabase Cloud (100% Gratis)

Para que todos los miembros de tu grupo compartan la misma base de datos en tiempo real:

1. Crea una cuenta gratuita en [https://supabase.com](https://supabase.com).
2. Crea un nuevo proyecto (ej. `seguidor-precios`).
3. Ve a la pestaña **SQL Editor** en Supabase, copia el contenido de [`supabase/schema.sql`](supabase/schema.sql) y dale clic a **Run**.
4. En la sección **Storage**, crea un bucket público llamado `photos`.
5. Ve a **Project Settings -> API** y copia tu `URL` y tu `anon public key`.
6. Crea un archivo `.env` en la raíz de este proyecto:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
7. Al recargar la app, verás la etiqueta **🟢 Nube Conectada** en el perfil y todos los datos se guardarán en PostgreSQL.

---

## 🌐 Despliegue Web Gratuito 24/7 (Vercel / Netlify / Cloudflare)

Puedes alojar esta aplicación web de forma gratuita y con HTTPS automático en:

### Despliegue en Vercel (Recomendado):
1. Sube este repositorio a tu cuenta de GitHub.
2. Inicia sesión en [Vercel](https://vercel.com) e importa el repositorio.
3. En **Environment Variables**, añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Clic en **Deploy** y obtendrás tu URL pública lista para compartir con tu comunidad.

---

## 📂 Arquitectura del Proyecto (Clean & Modular)

```
src/
├── types/              # DTOs e Interfaces (Product, Store, PriceEntry, Rating, User, SmartBadges)
├── services/           # Lógica de datos (DataService, SupabaseClient, ImageUpload, SmartBadgeEngine)
├── context/            # Estado global (AuthContext, AppDataContext)
├── components/
│   ├── layout/         # Header, BottomNav (mobile-first)
│   ├── products/       # ProductCard, ProductDetailModal, PriceHistoryChart, SmartBadgeTag
│   ├── stores/         # StoreCard, AddStoreModal
│   ├── forms/          # AddProductModal, AddPriceModal, RateProductModal
│   └── common/         # SearchFilterBar, PhotoUploader
├── pages/              # ExplorePage, DealsPage, SmartFinderPage, StoresPage, ProfilePage, AuthModal
└── utils/              # Formatters de moneda/fechas, Datos de muestra iniciales
```
