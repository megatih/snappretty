import { save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { Image } from '@tauri-apps/api/image';
import { writeImage } from '@tauri-apps/plugin-clipboard-manager';

export async function canvasToUint8Array(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg',
  quality: number
): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to create blob from canvas'))),
      mimeType,
      quality / 100
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

export async function exportToFile(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg',
  quality: number
): Promise<boolean> {
  const extension = format === 'png' ? 'png' : 'jpg';

  const filePath = await save({
    filters: [
      {
        name: `${format.toUpperCase()} Image`,
        extensions: [extension],
      },
    ],
    defaultPath: `screenshot.${extension}`,
  });

  if (!filePath) return false;

  const data = await canvasToUint8Array(canvas, format, quality);
  await invoke('save_file', { path: filePath, data: Array.from(data) });
  return true;
}

export async function copyToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas 2d context');

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rgba = new Uint8Array(imageData.data.buffer);
  const image = await Image.new(rgba, canvas.width, canvas.height);
  await writeImage(image);
}
