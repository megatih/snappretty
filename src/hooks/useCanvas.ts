import { useCallback } from 'react';

export function useCanvasExport() {
  const getCanvas = useCallback((): HTMLCanvasElement | null => {
    return (window as unknown as Record<string, HTMLCanvasElement>).__snappretty_canvas ?? null;
  }, []);

  const toDataUrl = useCallback(
    (format: 'png' | 'jpg' = 'png', quality = 92): string | null => {
      const canvas = getCanvas();
      if (!canvas) return null;
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      return canvas.toDataURL(mimeType, quality / 100);
    },
    [getCanvas]
  );

  return { getCanvas, toDataUrl };
}
