# SnapPretty

A cross-platform desktop application that transforms plain screenshots into beautiful, shareable images. Add gradient backgrounds, padding, rounded corners, drop shadows, and device window frames — then export or copy to clipboard in one click.

Built with [Tauri v2](https://v2.tauri.app/), React 19, and TypeScript.

## Features

- **Drag & Drop / Paste / Browse** — Load screenshots via drag-and-drop, clipboard paste (`Ctrl+V`), or file picker
- **Gradient & Solid Backgrounds** — 12 built-in gradient presets (Sunset, Ocean, Forest, Lavender, and more) or pick any solid color
- **Adjustable Padding** — 0–200px padding around your screenshot
- **Rounded Corners** — 0–48px corner radius
- **Drop Shadow** — Configurable blur, offset, and opacity with color picker
- **Device Frames** — Wrap your screenshot in a Browser, macOS, or Windows title bar
- **Social Media Presets** — One-click sizing for Twitter, LinkedIn, Instagram (Square/Story), Facebook, and Product Hunt
- **Export Options** — Save as PNG or JPG with adjustable quality (10–100%)
- **Copy to Clipboard** — Native clipboard support for pasting directly into other apps
- **Native OS Dialogs** — Uses system file dialogs for saving

## Screenshot

<!-- Add a screenshot or GIF of the app here -->
<!-- ![SnapPretty Screenshot](screenshot.png) -->

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Tauri v2](https://v2.tauri.app/) (Rust + WebView) |
| Frontend | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/) |
| Build Tool | [Vite 7](https://vite.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Components | [Radix UI](https://www.radix-ui.com/) (Slider, Select, Tooltip, ToggleGroup, Popover, DropdownMenu) |
| State Management | [Zustand](https://zustand.docs.pmnd.rs/) |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install) (1.77.2 or later)
- [Tauri v2 system dependencies](https://v2.tauri.app/start/prerequisites/)

### Linux

Install the required system libraries:

```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### macOS

```bash
xcode-select --install
```

### Windows

Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).

## Getting Started

```bash
# Clone the repository
git clone https://github.com/megatih/snappretty.git
cd snappretty

# Install dependencies
npm install

# Start development (launches Vite + Tauri dev window)
npm run dev
```

The app will open in a native window with hot-reload enabled.

## Building

### Production Build

```bash
npm run tauri:build
```

This compiles the frontend, builds the Rust binary in release mode, and produces platform-specific packages in `src-tauri/target/release/bundle/`:

| Platform | Output |
|----------|--------|
| Linux | `.deb`, `.rpm`, `.AppImage` |
| macOS | `.dmg`, `.app` |
| Windows | `.msi`, `.exe` (NSIS) |

### Debug Build

```bash
npm run tauri:build-debug
```

Produces an unoptimized build with debug symbols and logging enabled.

## Project Structure

```
snappretty/
├── src/                          # React frontend
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── BeautifyCanvas.tsx   # Main preview canvas (live rendering)
│   │   │   └── DropZone.tsx         # Image input (drag, click, paste)
│   │   ├── Toolbar/
│   │   │   └── Toolbar.tsx          # Right-side settings panel
│   │   ├── Sidebar/
│   │   │   └── TopBar.tsx           # Top bar with export buttons
│   │   └── Annotations/
│   │       └── AnnotationLayer.tsx  # Overlay canvas for annotations
│   ├── hooks/
│   │   ├── useCanvas.ts             # Canvas accessor + toDataUrl
│   │   └── useImageLoader.ts        # Load image from File or data URL
│   ├── stores/
│   │   └── useStore.ts              # Zustand global state
│   ├── utils/
│   │   ├── canvas.ts                # Core canvas rendering logic
│   │   ├── export.ts                # Save-to-file + copy-to-clipboard
│   │   └── redaction.ts             # Sensitive data detection patterns
│   ├── App.tsx                      # Root layout
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles (Tailwind)
│
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── main.rs                  # Binary entry point
│   │   └── lib.rs                   # Tauri builder, plugins, commands
│   ├── capabilities/
│   │   └── default.json             # Permission declarations
│   ├── icons/                       # App icons (all platforms)
│   ├── tauri.conf.json              # Tauri app configuration
│   └── Cargo.toml                   # Rust dependencies
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

## How It Works

1. **Image Input** — The `DropZone` component accepts images via drag-and-drop, file picker, or clipboard paste and stores them in Zustand state.

2. **Live Rendering** — `BeautifyCanvas` re-draws an HTML Canvas on every state change using the `renderCanvas()` utility, applying the background, padding, corners, shadow, and device frame in sequence.

3. **Export** — The canvas is converted to a `Uint8Array` blob, then either written to disk via Tauri's `save_file` IPC command (with a native save dialog) or written to the OS clipboard as a raw image.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |
| `npm run tauri:build` | Production Tauri build with bundled packages |
| `npm run tauri:build-debug` | Debug Tauri build with logging |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
