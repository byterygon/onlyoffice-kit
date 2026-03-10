# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`onlyoffice-kit` is a toolkit/SDK for working with [OnlyOffice](https://www.onlyoffice.com/), hosted at `github.com/byterygon/onlyoffice-kit`.

### Idea

Packages are published under the `@byterygon/onlyoffice-kit-<package>` scope. The monorepo contains the following packages:

- **core** — Wraps the OnlyOffice editor inside a Web Component to isolate it from the host page's `window`. The official SDK injects an iframe and exposes its APIs on the main frame; this package instead provides a **Controller** (inspired by Mapbox GL's `Map` class). The user creates a Controller with a target `<div>` element (or its ID), and the Controller injects a Web Component into that element. Communication with the editor and its events flows through the Web Component's `MessageChannel`. The Controller also exposes methods for managing plugins by accepting plugin descriptors as input. This package also re-exports all type definitions (config options, editor events, message payloads, plugin APIs) so consumers only need to install `core`.
- **plugins** — OnlyOffice editor plugins:
  - **bridge** — OnlyOffice plugins run in iframes and expose `callCommand`, `executeMethod`, and event-attachment APIs that are only accessible from within the plugin iframe. Because the plugin is hosted on the same origin as the main frame, this package uses a `BroadcastChannel` (keyed by a unique ID provided when the plugin is configured in the Controller) to bridge communication between the main frame and the plugin iframe, so those APIs can be invoked from the main frame.
  - **copy-paste** — The native context-menu copy/paste in OnlyOffice cannot read from the system clipboard; users must use Ctrl+C / Ctrl+V. This plugin uses the Clipboard API (`navigator.clipboard.read`) together with OnlyOffice's `pasteText` / `pasteHTML` commands to enable context-menu paste.
- **types** — Type-safe definitions for OnlyOffice configuration options, editor events, message payloads, and plugin APIs. This is an internal workspace package (not published separately); `core` re-exports its public types.
- **utils** — Shared utilities consumed by the other packages.
- **react, vue, angular** — Framework-specific wrappers around `core`, with an API style similar to Tiptap's framework integrations.

### Plugin Descriptor API

Plugins follow a declarative descriptor pattern inspired by Tiptap's `.create()` / `.configure()`:

```ts
// Plugin author defines a descriptor (not instantiated by users)
const BridgePlugin = definePlugin({
  name: 'bridge',
  // ...plugin capabilities
})

// Consumer configures and passes to Controller
const editor = new Controller({
  element: '#editor',
  plugins: [
    BridgePlugin.configure({ /* options */ }),
  ],
})
```

- `definePlugin()` returns a descriptor object, not an instance. The Controller handles instantiation internally.
- `.configure(options)` returns a new descriptor with overridden options.
- `.extend(overrides)` creates a derived descriptor, inheriting the base and overriding specific fields.

### Toolchain

This project is a monorepo managed with **pnpm workspaces** and **Nx** for task orchestration.

- **CI/CD** — GitHub Actions
- **Versioning** — Changesets
- **Build** — Vite (library mode)
- **Playground** — A local playground app for manual testing during development
- **Unit tests** — Vitest
- **E2E tests** — Playwright (if beneficial for testing editor interactions)

### Conventions

- Each package re-exports its public API from `src/index.ts`
- Package naming: `@byterygon/onlyoffice-kit-<name>` (plugins: `@byterygon/onlyoffice-kit-plugin-<name>`)
- Build output: `dist/` per package (ESM + CJS via Vite library mode, `.d.ts` via `vite-plugin-dts`)
- Internal imports use pnpm workspace protocol (`"workspace:*"`)
- Nx caching for `build`, `test`, `lint`, `typecheck`; `build` depends on upstream `build`
- Changesets: one per logical change; CI auto-publishes on merge to `main`
