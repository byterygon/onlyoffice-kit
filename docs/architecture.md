# Architecture

## Overview

`onlyoffice-kit` is an SDK for integrating and extending the OnlyOffice editor. It provides a framework-agnostic developer experience, avoiding the official SDK's global `window` pollution and tight iframe coupling.

Repository: `github.com/byterygon/onlyoffice-kit`

## Monorepo Structure

pnpm workspaces + Nx. Packages published under `@byterygon/onlyoffice-kit-*`.

## Packages

### core (`@byterygon/onlyoffice-kit-core`)

The main consumer-facing package. Responsibilities:

- Wraps OnlyOffice editor inside a **Web Component** to isolate it from the host `window`
- Provides a **Controller** API (inspired by Mapbox GL's `Map` class)
- Communicates with the editor via **MessageChannel**
- Manages plugin lifecycle
- Re-exports all public types from the `types` package

Users create an editor through `Controller`:

```ts
const editor = new Controller({
  element: '#editor',
});
```

Controller internals:

1. Injects a Web Component into the target DOM node
2. Initializes the OnlyOffice iframe inside the shadow DOM
3. Sets up MessageChannel for event messaging
4. Loads and manages configured plugins
5. Exposes public API for editor control

Consumers only need to install `@byterygon/onlyoffice-kit-core`.

### types (`@byterygon/onlyoffice-kit-types`)

Internal workspace package (not published separately). Contains type definitions for:

- Editor configuration options
- Message payloads
- Editor events
- Plugin APIs

All public types are re-exported via `core`.

### utils (`@byterygon/onlyoffice-kit-utils`)

Shared utilities consumed by other packages. Must remain stateless and framework-independent.

### plugins (`@byterygon/onlyoffice-kit-plugin-*`)

#### bridge

Exposes OnlyOffice plugin iframe APIs (`callCommand`, `executeMethod`, `attachEvent`) to the main frame using `BroadcastChannel`. The channel name is derived from a unique plugin instance ID passed during configuration.

#### copy-paste

Enables context-menu paste using `navigator.clipboard.read` combined with OnlyOffice's `pasteText` / `pasteHTML` commands. Solves the limitation where native context-menu copy/paste cannot read the system clipboard.

### Framework wrappers

| Package | Scope                               |
| ------- | ----------------------------------- |
| react   | `@byterygon/onlyoffice-kit-react`   |
| vue     | `@byterygon/onlyoffice-kit-vue`     |
| angular | `@byterygon/onlyoffice-kit-angular` |

Thin wrappers around `core` following Tiptap-style framework integrations. They must only:

- Initialize Controller
- Bind framework lifecycle hooks
- Expose reactive props/events

Framework wrappers must **not** duplicate core logic.

## Dependency Direction

```
utils/types → core → plugins → framework wrappers
```

- Plugins must not depend on framework packages
- Framework wrappers depend only on `core`
- `core` depends on `types` and `utils`
