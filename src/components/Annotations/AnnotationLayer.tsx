import { useRef, useState, useCallback, useEffect } from 'react';

export type AnnotationTool = 'none' | 'arrow' | 'rectangle' | 'text' | 'blur';

interface Point {
  x: number;
  y: number;
}

interface Annotation {
  type: AnnotationTool;
  start: Point;
  end: Point;
  color: string;
  text?: string;
}

interface AnnotationLayerProps {
  width: number;
  height: number;
  tool: AnnotationTool;
  color: string;
  onRender: (canvas: HTMLCanvasElement) => void;
}

export function AnnotationLayer({ width, height, tool, color, onRender }: AnnotationLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<Point>({ x: 0, y: 0 });
  const [current, setCurrent] = useState<Point>({ x: 0, y: 0 });

  const getPos = (e: React.MouseEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (tool === 'none') return;
      const pos = getPos(e);
      setDrawing(true);
      setStart(pos);
      setCurrent(pos);
    },
    [tool]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!drawing) return;
      setCurrent(getPos(e));
    },
    [drawing]
  );

  const handleMouseUp = useCallback(() => {
    if (!drawing) return;
    setDrawing(false);

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        setAnnotations((prev) => [...prev, { type: tool, start, end: current, color, text }]);
      }
    } else {
      setAnnotations((prev) => [...prev, { type: tool, start, end: current, color }]);
    }
  }, [drawing, tool, start, current, color]);

  const renderAnnotations = useCallback(
    (ctx: CanvasRenderingContext2D, list: Annotation[], preview?: { type: AnnotationTool; start: Point; end: Point }) => {
      const allItems = [...list];
      if (preview) {
        allItems.push({ type: preview.type, start: preview.start, end: preview.end, color });
      }

      for (const ann of allItems) {
        ctx.strokeStyle = ann.color;
        ctx.fillStyle = ann.color;
        ctx.lineWidth = 3;

        switch (ann.type) {
          case 'arrow': {
            const dx = ann.end.x - ann.start.x;
            const dy = ann.end.y - ann.start.y;
            const angle = Math.atan2(dy, dx);
            const headLen = 15;

            ctx.beginPath();
            ctx.moveTo(ann.start.x, ann.start.y);
            ctx.lineTo(ann.end.x, ann.end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(ann.end.x, ann.end.y);
            ctx.lineTo(
              ann.end.x - headLen * Math.cos(angle - Math.PI / 6),
              ann.end.y - headLen * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              ann.end.x - headLen * Math.cos(angle + Math.PI / 6),
              ann.end.y - headLen * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
            break;
          }
          case 'rectangle': {
            const rx = Math.min(ann.start.x, ann.end.x);
            const ry = Math.min(ann.start.y, ann.end.y);
            const rw = Math.abs(ann.end.x - ann.start.x);
            const rh = Math.abs(ann.end.y - ann.start.y);
            ctx.strokeRect(rx, ry, rw, rh);
            break;
          }
          case 'text': {
            if (ann.text) {
              ctx.font = '16px sans-serif';
              ctx.fillText(ann.text, ann.start.x, ann.start.y);
            }
            break;
          }
          case 'blur': {
            const bx = Math.min(ann.start.x, ann.end.x);
            const by = Math.min(ann.start.y, ann.end.y);
            const bw = Math.abs(ann.end.x - ann.start.x);
            const bh = Math.abs(ann.end.y - ann.start.y);
            if (bw > 0 && bh > 0) {
              ctx.save();
              ctx.filter = 'blur(8px)';
              ctx.drawImage(ctx.canvas, bx, by, bw, bh, bx, by, bw, bh);
              ctx.restore();
              ctx.strokeStyle = 'rgba(200,200,200,0.5)';
              ctx.strokeRect(bx, by, bw, bh);
            }
            break;
          }
        }
      }
    },
    [color]
  );

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const preview = drawing ? { type: tool, start, end: current } : undefined;
    renderAnnotations(ctx, annotations, preview);
    onRender(canvas);
  }, [annotations, drawing, tool, start, current, width, height, renderAnnotations, onRender]);

  if (tool === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 cursor-crosshair"
      style={{ width: '100%', height: '100%' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
