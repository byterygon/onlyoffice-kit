# Toolchain

## Monorepo

- **pnpm** workspaces for package management
- **Nx** for task orchestration, caching, and code generation

## Development Stack

| Area       | Tool                |
| ---------- | ------------------- |
| Build      | Vite (library mode) |
| Types      | TypeScript          |
| Unit tests | Vitest              |
| E2E tests  | Playwright          |
| Versioning | Changesets          |
| CI/CD      | GitHub Actions      |
| Formatting | Prettier            |
| Linting    | ESLint              |

A **playground app** is available for manual development and testing.

## Code Generation

Always use official generators for scaffolding new packages or projects:

```
nx g
pnpm create
pnpm init
pnpm create vite
```

Do **not** manually create from scratch:

- `package.json`
- `tsconfig.json` / `tsconfig.*.json`
- `vite.config.ts`
- Nx project configs

Editing existing generated files is fine.

## Pre-commit Hooks

The repository uses **Husky** + **lint-staged**.

Pre-commit automatically runs:

- **ESLint** — linting
- **Prettier** — formatting

Rules:

- All code must pass lint and formatting before commit
- Never bypass hooks with `--no-verify`
- Ensure staged files are clean before committing
