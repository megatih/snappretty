import { useCallback } from 'react';
import { useStore } from '../stores/useStore';

export function useImageLoader() {
  const setSourceImage = useStore((s) => s.setSourceImage);

  const loadFromFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataUrl;
      });

      setSourceImage(img, dataUrl);
    },
    [setSourceImage]
  );

  const loadFromDataUrl = useCallback(
    async (dataUrl: string) => {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataUrl;
      });

      setSourceImage(img, dataUrl);
    },
    [setSourceImage]
  );

  return { loadFromFile, loadFromDataUrl };
}
