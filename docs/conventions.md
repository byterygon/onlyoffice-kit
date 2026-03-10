# Project Conventions

## Package Naming

```
@byterygon/onlyoffice-kit-<name>
@byterygon/onlyoffice-kit-plugin-<name>
```

## Public API

Each package must expose its public API from `src/index.ts`.

## Build Output

Output directory: `dist/`

Formats: ESM + CJS + `.d.ts`

Generated using Vite library mode with `vite-plugin-dts`.

## Workspace Dependencies

Internal dependencies must use the pnpm workspace protocol:

```json
"@byterygon/onlyoffice-kit-types": "workspace:*"
```

## Nx Task Rules

Nx handles task orchestration, caching, and code generation.

Cached tasks: `build`, `test`, `lint`, `typecheck`

Build dependency rule: `build` depends on upstream `build` (packages build in dependency order).

## Changesets Workflow

- One changeset per logical change
- CI publishes automatically on merge to `main`
- Do not manually bump versions
- Breaking API changes require a major version bump

## Testing

- **Unit tests:** Vitest
- **E2E tests:** Playwright (when editor interaction is required)

Tests should cover: message channel communication, plugin lifecycle, controller initialization, iframe isolation.

## Documentation

Maintain docs in `docs/` and `README.md`. Cover architecture, plugin API, controller usage, and framework integrations. Examples should be runnable in the playground app.
