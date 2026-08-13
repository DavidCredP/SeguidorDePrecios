import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, Loader2, Sparkles } from 'lucide-react';
import { uploadImage } from '../../services/imageUploadService';

interface PhotoUploaderProps {
  label: string;
  initialUrl?: string;
  onPhotoUploaded: (url: string) => void;
  folder?: 'products' | 'evidence' | 'stores';
  helperText?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  label,
  initialUrl,
  onPhotoUploaded,
  folder = 'products',
  helperText = 'Sube una foto clara o usa la cámara de tu celular',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImage(file, folder);
      setPreviewUrl(uploadedUrl);
      onPhotoUploaded(uploadedUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(undefined);
    onPhotoUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col items-center justify-center min-h-[140px] text-center ${
          previewUrl
            ? 'border-emerald-500/40 bg-slate-900/60'
            : 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-4 text-emerald-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-medium">Optimizando y subiendo imagen...</span>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-36 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="max-h-full max-w-full object-contain rounded-xl shadow-md transition-transform group-hover:scale-105"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full shadow-lg transition-colors"
              title="Eliminar foto"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Clic para cambiar foto</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">
                Tomar foto o seleccionar archivo
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
    </div>
  );
};
