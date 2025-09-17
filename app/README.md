# Digital Golem Engine UI

Electron + React + TypeScript scaffold with Tailwind CSS for Project Chimera.

## Prerequisites
- Node.js LTS (use nvm: `nvm use --lts`)
- npm

## Install
```bash
npm install
```

## Development
```bash
npm run dev
```
Note: On headless systems without a display server, Electron may fail to launch. Use `npm run build` to verify packaging.

## Typecheck
```bash
npm run typecheck
```

## Build (renderer + electron + package)
```bash
npm run build
```

## UI Overview
- Genome Sequencer: Skeletal, Musculature, Dermal
- Neural Lattice Weaver: Foundational Model, Memory Matrix, Ethical Manifold
- Crucible Viewer: live JSON of current selections

Tailwind is configured via `@tailwindcss/postcss`. Styles are imported in `src/index.css`.
