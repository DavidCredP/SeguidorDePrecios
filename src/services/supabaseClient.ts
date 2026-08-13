import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from Vite env variables
let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

// Sanitize URL: remove /rest/v1, /rest/v1/, or any trailing slash
if (rawUrl) {
  rawUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export const supabaseUrl = rawUrl;
export const supabaseAnonKey = supabaseKey;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length >= 20
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Tests live connectivity to Supabase PostgreSQL and measures latency
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  latencyMs: number;
  message: string;
  projectHost: string;
}> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      latencyMs: 0,
      message: 'Las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configuradas en .env',
      projectHost: 'Desconectado',
    };
  }

  const start = performance.now();
  try {
    const host = new URL(supabaseUrl).hostname;
    // Ping stores table or check server response
    const { error } = await supabase.from('stores').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // If table doesn't exist yet, it reached the server but schema is missing
      if (error.code === '42P01' || error.message.includes('relation "public.stores" does not exist')) {
        return {
          success: true,
          latencyMs,
          message: '¡Conexión establecida con Supabase! Falta ejecutar el script supabase/schema.sql en el SQL Editor.',
          projectHost: host,
        };
      }
      return {
        success: false,
        latencyMs,
        message: `Error al consultar Supabase: ${error.message} (${error.code || 'Desconocido'})`,
        projectHost: host,
      };
    }

    return {
      success: true,
      latencyMs,
      message: `¡Conexión activa y tablas verificadas en ${latencyMs}ms!`,
      projectHost: host,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: false,
      latencyMs,
      message: `No se pudo conectar a Supabase: ${err.message || 'Verifica tu conexión a internet o la URL del proyecto.'}`,
      projectHost: supabaseUrl,
    };
  }
};
