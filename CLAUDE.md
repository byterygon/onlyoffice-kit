# CLAUDE.md

Instructions for Claude Code (claude.ai/code) working in this repository.

Full documentation lives in [`docs/`](docs/agent-reference.md). This file is the concise entrypoint.

## Project

`onlyoffice-kit` — SDK for integrating and extending OnlyOffice. Monorepo: pnpm + Nx. Published under `@byterygon/onlyoffice-kit-*`.

## Docs

| File                                           | Contents                                               |
| ---------------------------------------------- | ------------------------------------------------------ |
| [docs/architecture.md](docs/architecture.md)   | Packages, Controller API, dependency graph             |
| [docs/plugin-system.md](docs/plugin-system.md) | `definePlugin` / `.configure()` / `.extend()`          |
| [docs/conventions.md](docs/conventions.md)     | Naming, build, workspace deps, Nx, Changesets, testing |
| [docs/toolchain.md](docs/toolchain.md)         | Build stack, code generation, pre-commit hooks         |

## Packages (quick ref)

| Package               | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| **core**              | Web Component wrapper + Controller API (re-exports types)     |
| **types**             | Internal type definitions (not published separately)          |
| **utils**             | Shared stateless utilities                                    |
| **plugin-bridge**     | Exposes plugin iframe APIs to main frame via BroadcastChannel |
| **plugin-copy-paste** | Enables context-menu paste using Clipboard API                |
| **react/vue/angular** | Thin framework wrappers around core                           |

Dependency direction: `utils/types → core → plugins → framework wrappers`

## Rules

1. **Use generators** for scaffolding (`nx g`, `pnpm create`, `pnpm init`). Never hand-write `package.json`, `tsconfig`, `vite.config` from scratch.
2. **Never bypass hooks** — `--no-verify` is forbidden. Husky + lint-staged enforce ESLint + Prettier.
3. **Small, incremental changes.** Breaking API changes require major version bump via Changesets.
4. **Respect package boundaries.** Core logic in `core`; framework packages stay thin.
5. **Test changes** — Vitest (unit), Playwright (E2E). Run relevant targets for touched packages.
