import { create } from 'zustand';

export type BackgroundType = 'solid' | 'gradient' | 'image';

export interface GradientPreset {
  name: string;
  css: string;
  colors: string[];
  angle: number;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Sunset', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', colors: ['#f093fb', '#f5576c'], angle: 135 },
  { name: 'Ocean', css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', colors: ['#4facfe', '#00f2fe'], angle: 135 },
  { name: 'Forest', css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', colors: ['#43e97b', '#38f9d7'], angle: 135 },
  { name: 'Lavender', css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', colors: ['#a18cd1', '#fbc2eb'], angle: 135 },
  { name: 'Peach', css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', colors: ['#ffecd2', '#fcb69f'], angle: 135 },
  { name: 'Night', css: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2d1b69 100%)', colors: ['#0c0c1d', '#1a1a3e', '#2d1b69'], angle: 135 },
  { name: 'Flame', css: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)', colors: ['#f83600', '#f9d423'], angle: 135 },
  { name: 'Arctic', css: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', colors: ['#e0eafc', '#cfdef3'], angle: 135 },
  { name: 'Berry', css: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)', colors: ['#8360c3', '#2ebf91'], angle: 135 },
  { name: 'Coral', css: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', colors: ['#ff9a9e', '#fad0c4'], angle: 135 },
  { name: 'Midnight', css: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', colors: ['#2b5876', '#4e4376'], angle: 135 },
  { name: 'Cotton Candy', css: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', colors: ['#a1c4fd', '#c2e9fb'], angle: 135 },
];

export type DeviceFrame = 'none' | 'browser' | 'macos' | 'windows';

export interface SocialPreset {
  name: string;
  width: number;
  height: number;
}

export const SOCIAL_PRESETS: SocialPreset[] = [
  { name: 'Auto', width: 0, height: 0 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'Instagram Square', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Product Hunt', width: 1270, height: 760 },
];

export interface AppState {
  // Image
  sourceImage: HTMLImageElement | null;
  sourceImageData: string | null;

  // Background
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradientPreset: number;
  backgroundImage: string | null;

  // Styling
  padding: number;
  cornerRadius: number;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  shadowOpacity: number;

  // Frame
  deviceFrame: DeviceFrame;

  // Export
  socialPreset: number;
  exportFormat: 'png' | 'jpg';
  exportQuality: number;

  // Actions
  setSourceImage: (img: HTMLImageElement | null, dataUrl: string | null) => void;
  setBackgroundType: (type: BackgroundType) => void;
  setBackgroundColor: (color: string) => void;
  setGradientPreset: (index: number) => void;
  setBackgroundImage: (url: string | null) => void;
  setPadding: (padding: number) => void;
  setCornerRadius: (radius: number) => void;
  setShadowBlur: (blur: number) => void;
  setShadowOffsetX: (x: number) => void;
  setShadowOffsetY: (y: number) => void;
  setShadowColor: (color: string) => void;
  setShadowOpacity: (opacity: number) => void;
  setDeviceFrame: (frame: DeviceFrame) => void;
  setSocialPreset: (index: number) => void;
  setExportFormat: (format: 'png' | 'jpg') => void;
  setExportQuality: (quality: number) => void;
  reset: () => void;
}

const initialState = {
  sourceImage: null,
  sourceImageData: null,
  backgroundType: 'gradient' as BackgroundType,
  backgroundColor: '#667eea',
  gradientPreset: 0,
  backgroundImage: null,
  padding: 64,
  cornerRadius: 12,
  shadowBlur: 40,
  shadowOffsetX: 0,
  shadowOffsetY: 20,
  shadowColor: '#000000',
  shadowOpacity: 0.4,
  deviceFrame: 'none' as DeviceFrame,
  socialPreset: 0,
  exportFormat: 'png' as const,
  exportQuality: 92,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setSourceImage: (img, dataUrl) => set({ sourceImage: img, sourceImageData: dataUrl }),
  setBackgroundType: (type) => set({ backgroundType: type }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setGradientPreset: (index) => set({ gradientPreset: index }),
  setBackgroundImage: (url) => set({ backgroundImage: url }),
  setPadding: (padding) => set({ padding }),
  setCornerRadius: (radius) => set({ cornerRadius: radius }),
  setShadowBlur: (blur) => set({ shadowBlur: blur }),
  setShadowOffsetX: (x) => set({ shadowOffsetX: x }),
  setShadowOffsetY: (y) => set({ shadowOffsetY: y }),
  setShadowColor: (color) => set({ shadowColor: color }),
  setShadowOpacity: (opacity) => set({ shadowOpacity: opacity }),
  setDeviceFrame: (frame) => set({ deviceFrame: frame }),
  setSocialPreset: (index) => set({ socialPreset: index }),
  setExportFormat: (format) => set({ exportFormat: format }),
  setExportQuality: (quality) => set({ exportQuality: quality }),
  reset: () => set(initialState),
}));
