// components/FileUpload.tsx - Composant réutilisable pour upload de fichiers
"use client";

import { useState } from 'react';
import { Upload, X, File, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // en MB
  currentFile?: { nom: string; url: string } | null;
  onFileUploaded: (fileId: string) => void;
  required?: boolean;
}

export default function FileUpload({ 
  label, 
  accept = ".pdf,.jpg,.jpeg,.png", 
  maxSize = 5,
  currentFile,
  onFileUploaded,
  required = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ nom: string; url: string } | null>(currentFile || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Le fichier ne doit pas dépasser ${maxSize}MB`);
      return;
    }

    const loadingToast = toast.loading('Téléchargement du fichier...');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur upload');
      }

      const data = await res.json();
      
      setUploadedFile({ 
        nom: data.fichier.nom, 
        url: data.fichier.url 
      });
      
      onFileUploaded(data.fichier._id);
      
      toast.success('Fichier téléchargé avec succès', { id: loadingToast });
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    onFileUploaded('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {uploadedFile ? (
        // Fichier uploadé
        <div className="border-2 border-emerald-200 bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{uploadedFile.nom}</p>
                <p className="text-xs text-slate-600">Fichier téléchargé</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        // Zone d'upload
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-slate-300 transition-colors">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${label}`}
          />
          
          <label
            htmlFor={`file-upload-${label}`}
            className="cursor-pointer flex flex-col items-center"
          >
            {uploading ? (
              <>
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-3" />
                <p className="text-sm text-slate-600">Téléchargement...</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-slate-400 mb-3" />
                <p className="text-sm text-slate-600 mb-2">
                  Cliquez pour sélectionner un fichier
                </p>
                <p className="text-xs text-slate-500">
                  {accept.replace(/\./g, '').toUpperCase()} · Max {maxSize}MB
                </p>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
}