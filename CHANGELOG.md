# Changelog

All notable changes to SnapPretty will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-03-01

### Added

#### Core Functionality
- Drag-and-drop image loading with visual feedback
- Click-to-browse file picker for image selection
- Clipboard paste support (`Ctrl+V`) for loading screenshots directly
- Live canvas preview that updates in real-time as settings change

#### Background Customization
- 12 gradient background presets: Sunset, Ocean, Forest, Lavender, Peach, Night, Flame, Arctic, Berry, Coral, Midnight, Cotton Candy
- Solid color background with 20 preset colors
- Custom solid color picker with hex input

#### Image Styling
- Adjustable padding (0–200px, default 64px)
- Configurable corner radius (0–48px, default 12px)
- Drop shadow with customizable blur (0–100px), Y-offset (-50 to 50px), opacity (0–100%), and color

#### Device Frames
- Browser window frame with traffic light buttons and URL bar
- macOS window frame with native-style title bar
- Windows window frame with minimize/maximize/close buttons
- Option to disable frames entirely

#### Social Media Presets
- Auto-size mode (fits to image dimensions)
- Twitter Post (1200 x 675)
- LinkedIn Post (1200 x 627)
- Instagram Square (1080 x 1080)
- Instagram Story (1080 x 1920)
- Facebook Post (1200 x 630)
- Product Hunt (1270 x 760)

#### Export
- PNG export with lossless quality
- JPG export with adjustable quality (10–100%)
- Native OS save dialog for choosing export location
- Copy to clipboard as native image (paste directly into other apps)

#### Desktop Application
- Cross-platform desktop app built with Tauri v2
- Native window with configurable size (1100 x 750, min 800 x 600)
- Content Security Policy for secure webview rendering
- Linux distribution packages: `.deb`, `.rpm`, `.AppImage`
- macOS distribution: `.dmg`, `.app`
- Windows distribution: `.msi`, `.exe` (NSIS installer)

#### Developer Experience
- React 19 + TypeScript 5.9 frontend
- Vite 7 with hot module replacement
- Tailwind CSS v4 for utility-first styling
- Radix UI for accessible, unstyled UI primitives
- Zustand for lightweight global state management
- ESLint with React hooks and refresh plugins
- Convenience build scripts (`tauri:build`, `tauri:build-debug`)

#### Internal (Not Yet Exposed in UI)
- Annotation layer with arrow, rectangle, text, and blur tools
- Sensitive data redaction utilities with pattern detection for emails, API keys, AWS credentials, credit cards, bearer tokens, private keys, GitHub tokens, and Slack tokens

[0.1.0]: https://github.com/megatih/snappretty/releases/tag/v0.1.0
