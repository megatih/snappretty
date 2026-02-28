import { useStore } from '../../stores/useStore';
import { exportToFile, copyToClipboard } from '../../utils/export';
import { useCallback, useState } from 'react';

function getCanvas(): HTMLCanvasElement | null {
  return (window as unknown as Record<string, HTMLCanvasElement>).__snappretty_canvas ?? null;
}

export function TopBar() {
  const { sourceImage, exportFormat, exportQuality, setSourceImage } = useStore();
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleExport = useCallback(async () => {
    const canvas = getCanvas();
    if (!canvas) return;
    try {
      await exportToFile(canvas, exportFormat, exportQuality);
    } catch (err) {
      console.error('Failed to export:', err);
    }
  }, [exportFormat, exportQuality]);

  const handleCopy = useCallback(async () => {
    const canvas = getCanvas();
    if (!canvas) return;
    try {
      await copyToClipboard(canvas);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleNewImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => setSourceImage(img, dataUrl);
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [setSourceImage]);

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-gray-800 tracking-tight">SnapPretty</h1>
        {sourceImage && (
          <button
            onClick={handleNewImage}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            Open image
          </button>
        )}
      </div>

      {sourceImage && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-all ${
              copyFeedback
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copyFeedback ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleExport}
            className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
}
