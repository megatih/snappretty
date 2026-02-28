import { useCallback, useState, useEffect } from 'react';
import { useStore } from '../../stores/useStore';

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const { sourceImage, setSourceImage } = useStore();

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const dataUrl = await fileToDataUrl(file);
      const img = await loadImageFromDataUrl(dataUrl);
      setSourceImage(img, dataUrl);
    },
    [setSourceImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  // Handle paste
  useEffect(() => {
    const handler = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            await handleFile(file);
            return;
          }
        }
      }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [handleFile]);

  if (sourceImage) return null;

  return (
    <div
      className={`flex-1 flex items-center justify-center ${
        isDragging ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-300'
      } border-2 border-dashed rounded-xl m-8 cursor-pointer transition-colors`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="text-center p-8">
        <div className="text-6xl mb-4 opacity-40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-gray-400"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-600 mb-2">
          Drop an image here, paste from clipboard, or click to browse
        </p>
        <p className="text-sm text-gray-400">
          Supports PNG, JPG, WebP, and more
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
          <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-500 font-mono">Ctrl+V</kbd>
          <span>to paste</span>
        </div>
      </div>
    </div>
  );
}
