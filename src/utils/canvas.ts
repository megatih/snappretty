import { type DeviceFrame, GRADIENT_PRESETS, SOCIAL_PRESETS, type AppState } from '../stores/useStore';

const FRAME_HEIGHTS: Record<DeviceFrame, number> = {
  none: 0,
  browser: 40,
  macos: 28,
  windows: 32,
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBrowserFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  radius: number
) {
  const h = FRAME_HEIGHTS.browser;

  // Frame background
  ctx.fillStyle = '#e8e8e8';
  drawRoundedRect(ctx, x, y, w, h + 4, radius);
  ctx.fill();
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(x, y + h - 4, w, 8);

  // Traffic lights
  const dotY = y + h / 2;
  const dotColors = ['#ff5f57', '#febc2e', '#28c840'];
  dotColors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(x + 20 + i * 22, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // URL bar
  const barX = x + 90;
  const barW = w - 180;
  const barH = 22;
  const barY = y + (h - barH) / 2;
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, barX, barY, barW, barH, 4);
  ctx.fill();

  // URL text
  ctx.fillStyle = '#999';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('localhost:3000', barX + barW / 2, barY + 15);
  ctx.textAlign = 'start';
}

function drawMacOSFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  radius: number
) {
  const h = FRAME_HEIGHTS.macos;

  ctx.fillStyle = '#e8e8e8';
  drawRoundedRect(ctx, x, y, w, h + 4, radius);
  ctx.fill();
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(x, y + h - 4, w, 8);

  const dotY = y + h / 2;
  const dotColors = ['#ff5f57', '#febc2e', '#28c840'];
  dotColors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(x + 16 + i * 20, dotY, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
}

function drawWindowsFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  radius: number
) {
  const h = FRAME_HEIGHTS.windows;

  ctx.fillStyle = '#f0f0f0';
  drawRoundedRect(ctx, x, y, w, h + 4, radius);
  ctx.fill();
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(x, y + h - 4, w, 8);

  // Window controls (right side)
  const btnW = 46;
  const btnH = h;
  const btnY = y;

  // Minimize
  ctx.fillStyle = '#ccc';
  ctx.fillRect(x + w - btnW * 3, btnY + btnH / 2 - 0.5, 10, 1);

  // Maximize
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + w - btnW * 2 + 18, btnY + btnH / 2 - 5, 10, 10);

  // Close
  ctx.fillStyle = '#ccc';
  const closeX = x + w - btnW + 18;
  const closeY = btnY + btnH / 2;
  ctx.beginPath();
  ctx.moveTo(closeX, closeY - 5);
  ctx.lineTo(closeX + 10, closeY + 5);
  ctx.moveTo(closeX + 10, closeY - 5);
  ctx.lineTo(closeX, closeY + 5);
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Title
  ctx.fillStyle = '#333';
  ctx.font = '12px Segoe UI, sans-serif';
  ctx.fillText('SnapPretty', x + 12, y + h / 2 + 4);
}

export function renderCanvas(
  canvas: HTMLCanvasElement,
  state: Pick<
    AppState,
    | 'sourceImage'
    | 'backgroundType'
    | 'backgroundColor'
    | 'gradientPreset'
    | 'padding'
    | 'cornerRadius'
    | 'shadowBlur'
    | 'shadowOffsetX'
    | 'shadowOffsetY'
    | 'shadowColor'
    | 'shadowOpacity'
    | 'deviceFrame'
    | 'socialPreset'
  >
) {
  const ctx = canvas.getContext('2d');
  if (!ctx || !state.sourceImage) return;

  const img = state.sourceImage;
  const frameHeight = FRAME_HEIGHTS[state.deviceFrame];
  const padding = state.padding;

  // Calculate canvas dimensions
  const socialPreset = SOCIAL_PRESETS[state.socialPreset];
  let canvasW: number;
  let canvasH: number;

  if (socialPreset && socialPreset.width > 0) {
    canvasW = socialPreset.width;
    canvasH = socialPreset.height;
  } else {
    canvasW = img.width + padding * 2;
    canvasH = img.height + padding * 2 + frameHeight;
  }

  canvas.width = canvasW;
  canvas.height = canvasH;

  // Draw background
  if (state.backgroundType === 'gradient') {
    const preset = GRADIENT_PRESETS[state.gradientPreset];
    if (preset) {
      const angle = (preset.angle * Math.PI) / 180;
      const x1 = canvasW / 2 - (Math.cos(angle) * canvasW) / 2;
      const y1 = canvasH / 2 - (Math.sin(angle) * canvasH) / 2;
      const x2 = canvasW / 2 + (Math.cos(angle) * canvasW) / 2;
      const y2 = canvasH / 2 + (Math.sin(angle) * canvasH) / 2;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      preset.colors.forEach((color, i) => {
        gradient.addColorStop(i / (preset.colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
    }
  } else {
    ctx.fillStyle = state.backgroundColor;
  }
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Calculate image position (centered)
  let imgW = img.width;
  let imgH = img.height;

  if (socialPreset && socialPreset.width > 0) {
    const availableW = canvasW - padding * 2;
    const availableH = canvasH - padding * 2 - frameHeight;
    const scale = Math.min(availableW / img.width, availableH / img.height);
    imgW = img.width * scale;
    imgH = img.height * scale;
  }

  const imgX = (canvasW - imgW) / 2;
  const imgY = (canvasH - imgH - frameHeight) / 2 + frameHeight + (frameHeight > 0 ? padding / 4 : 0);

  // Draw shadow
  if (state.shadowBlur > 0) {
    ctx.save();
    ctx.shadowColor = hexToRgba(state.shadowColor, state.shadowOpacity);
    ctx.shadowBlur = state.shadowBlur;
    ctx.shadowOffsetX = state.shadowOffsetX;
    ctx.shadowOffsetY = state.shadowOffsetY;
    ctx.fillStyle = 'rgba(0,0,0,0)';

    const frameY = state.deviceFrame !== 'none' ? imgY - frameHeight : imgY;
    const totalH = state.deviceFrame !== 'none' ? imgH + frameHeight : imgH;

    drawRoundedRect(ctx, imgX, frameY, imgW, totalH, state.cornerRadius);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
  }

  // Draw device frame
  if (state.deviceFrame !== 'none') {
    const frameY = imgY - frameHeight;
    switch (state.deviceFrame) {
      case 'browser':
        drawBrowserFrame(ctx, imgX, frameY, imgW, state.cornerRadius);
        break;
      case 'macos':
        drawMacOSFrame(ctx, imgX, frameY, imgW, state.cornerRadius);
        break;
      case 'windows':
        drawWindowsFrame(ctx, imgX, frameY, imgW, state.cornerRadius);
        break;
    }
  }

  // Draw image with rounded corners
  ctx.save();
  const clipRadius = state.deviceFrame !== 'none'
    ? { tl: 0, tr: 0, bl: state.cornerRadius, br: state.cornerRadius }
    : { tl: state.cornerRadius, tr: state.cornerRadius, bl: state.cornerRadius, br: state.cornerRadius };

  ctx.beginPath();
  ctx.moveTo(imgX + clipRadius.tl, imgY);
  ctx.lineTo(imgX + imgW - clipRadius.tr, imgY);
  ctx.quadraticCurveTo(imgX + imgW, imgY, imgX + imgW, imgY + clipRadius.tr);
  ctx.lineTo(imgX + imgW, imgY + imgH - clipRadius.br);
  ctx.quadraticCurveTo(imgX + imgW, imgY + imgH, imgX + imgW - clipRadius.br, imgY + imgH);
  ctx.lineTo(imgX + clipRadius.bl, imgY + imgH);
  ctx.quadraticCurveTo(imgX, imgY + imgH, imgX, imgY + imgH - clipRadius.bl);
  ctx.lineTo(imgX, imgY + clipRadius.tl);
  ctx.quadraticCurveTo(imgX, imgY, imgX + clipRadius.tl, imgY);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, imgX, imgY, imgW, imgH);
  ctx.restore();
}
