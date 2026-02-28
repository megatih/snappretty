import { useStore, GRADIENT_PRESETS, SOCIAL_PRESETS, type DeviceFrame } from '../../stores/useStore';
import * as Slider from '@radix-ui/react-slider';

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs text-gray-400 tabular-nums">{value}</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
      </Slider.Root>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

const SOLID_COLORS = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529', '#000000',
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#a18cd1', '#fbc2eb',
];

const FRAME_OPTIONS: { value: DeviceFrame; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'browser', label: 'Browser' },
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
];

export function Toolbar() {
  const store = useStore();

  return (
    <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto p-4 space-y-6 shrink-0">
      {/* Background */}
      <Section title="Background">
        <div className="flex gap-1 mb-2">
          <button
            className={`flex-1 text-xs py-1.5 px-2 rounded font-medium transition-colors ${
              store.backgroundType === 'gradient'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => store.setBackgroundType('gradient')}
          >
            Gradient
          </button>
          <button
            className={`flex-1 text-xs py-1.5 px-2 rounded font-medium transition-colors ${
              store.backgroundType === 'solid'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => store.setBackgroundType('solid')}
          >
            Solid
          </button>
        </div>

        {store.backgroundType === 'gradient' ? (
          <div className="grid grid-cols-4 gap-1.5">
            {GRADIENT_PRESETS.map((preset, i) => (
              <button
                key={preset.name}
                className={`w-full aspect-square rounded-lg transition-all ${
                  store.gradientPreset === i
                    ? 'ring-2 ring-blue-500 ring-offset-1 scale-105'
                    : 'hover:scale-105'
                }`}
                style={{ background: preset.css }}
                onClick={() => store.setGradientPreset(i)}
                title={preset.name}
              />
            ))}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {SOLID_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-full aspect-square rounded-md border transition-all ${
                    store.backgroundColor === color
                      ? 'ring-2 ring-blue-500 ring-offset-1 scale-105'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => store.setBackgroundColor(color)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={store.backgroundColor}
                onChange={(e) => store.setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={store.backgroundColor}
                onChange={(e) => store.setBackgroundColor(e.target.value)}
                className="flex-1 text-xs font-mono px-2 py-1.5 border border-gray-200 rounded bg-gray-50"
              />
            </div>
          </div>
        )}
      </Section>

      {/* Padding & Corners */}
      <Section title="Layout">
        <SliderControl
          label="Padding"
          value={store.padding}
          min={0}
          max={200}
          onChange={store.setPadding}
        />
        <SliderControl
          label="Corner Radius"
          value={store.cornerRadius}
          min={0}
          max={48}
          onChange={store.setCornerRadius}
        />
      </Section>

      {/* Shadow */}
      <Section title="Shadow">
        <SliderControl
          label="Blur"
          value={store.shadowBlur}
          min={0}
          max={100}
          onChange={store.setShadowBlur}
        />
        <SliderControl
          label="Offset Y"
          value={store.shadowOffsetY}
          min={-50}
          max={50}
          onChange={store.setShadowOffsetY}
        />
        <SliderControl
          label="Opacity"
          value={Math.round(store.shadowOpacity * 100)}
          min={0}
          max={100}
          onChange={(v) => store.setShadowOpacity(v / 100)}
        />
      </Section>

      {/* Device Frame */}
      <Section title="Window Frame">
        <div className="grid grid-cols-2 gap-1.5">
          {FRAME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`text-xs py-2 px-3 rounded font-medium transition-colors ${
                store.deviceFrame === value
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => store.setDeviceFrame(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Social Presets */}
      <Section title="Size Preset">
        <select
          value={store.socialPreset}
          onChange={(e) => store.setSocialPreset(Number(e.target.value))}
          className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded bg-gray-50"
        >
          {SOCIAL_PRESETS.map((preset, i) => (
            <option key={preset.name} value={i}>
              {preset.name} {preset.width > 0 ? `(${preset.width}x${preset.height})` : ''}
            </option>
          ))}
        </select>
      </Section>

      {/* Export */}
      <Section title="Export">
        <div className="flex gap-1 mb-2">
          <button
            className={`flex-1 text-xs py-1.5 px-2 rounded font-medium transition-colors ${
              store.exportFormat === 'png'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => store.setExportFormat('png')}
          >
            PNG
          </button>
          <button
            className={`flex-1 text-xs py-1.5 px-2 rounded font-medium transition-colors ${
              store.exportFormat === 'jpg'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => store.setExportFormat('jpg')}
          >
            JPG
          </button>
        </div>
        {store.exportFormat === 'jpg' && (
          <SliderControl
            label="Quality"
            value={store.exportQuality}
            min={10}
            max={100}
            onChange={store.setExportQuality}
          />
        )}
      </Section>
    </div>
  );
}
