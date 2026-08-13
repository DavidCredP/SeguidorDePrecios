import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Resizes and compresses an image in the browser to reduce size and bandwidth.
 */
export const compressImageFile = (
  file: File,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Uploads an image to Supabase Storage bucket 'photos' or returns compressed Base64 data URL.
 */
export const uploadImage = async (
  file: File,
  folder: 'products' | 'evidence' | 'stores' = 'products'
): Promise<string> => {
  try {
    const compressedBase64 = await compressImageFile(file);

    if (isSupabaseConfigured() && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        // Convert base64 back to Blob for storage upload
        const response = await fetch(compressedBase64);
        const blob = await response.blob();

        const { data, error } = await supabase.storage
          .from('photos')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (!error && data?.path) {
          const { data: publicUrlData } = supabase.storage
            .from('photos')
            .getPublicUrl(data.path);

          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (cloudErr) {
        console.warn('Fallback to base64 storage due to Supabase upload error:', cloudErr);
      }
    }

    // Return compressed base64 if offline or Supabase storage is not configured yet
    return compressedBase64;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('No se pudo procesar la imagen seleccionada.');
  }
};
