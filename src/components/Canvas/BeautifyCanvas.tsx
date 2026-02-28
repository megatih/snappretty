import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../stores/useStore';
import { renderCanvas } from '../../utils/canvas';

export function BeautifyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    sourceImage,
    backgroundType,
    backgroundColor,
    gradientPreset,
    padding,
    cornerRadius,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowColor,
    shadowOpacity,
    deviceFrame,
    socialPreset,
  } = useStore();

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImage) return;

    renderCanvas(canvas, {
      sourceImage,
      backgroundType,
      backgroundColor,
      gradientPreset,
      padding,
      cornerRadius,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowColor,
      shadowOpacity,
      deviceFrame,
      socialPreset,
    });
  }, [
    sourceImage,
    backgroundType,
    backgroundColor,
    gradientPreset,
    padding,
    cornerRadius,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowColor,
    shadowOpacity,
    deviceFrame,
    socialPreset,
  ]);

  useEffect(() => {
    render();
  }, [render]);

  // Expose the canvas for export
  useEffect(() => {
    if (canvasRef.current) {
      exportCanvasRef.current = canvasRef.current;
    }
  });

  // Make export canvas accessible globally for export utils
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      (window as unknown as Record<string, HTMLCanvasElement>).__snappretty_canvas = canvas;
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__snappretty_canvas;
    };
  }, [sourceImage]);

  if (!sourceImage) {
    return null;
  }

  return (
    <div ref={containerRef} className="flex items-center justify-center flex-1 overflow-auto p-4">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}
