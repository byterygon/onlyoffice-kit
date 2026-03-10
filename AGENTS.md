# AGENTS.md

Quick-start instructions for coding agents (Claude Code, Codex, etc.) working in this repository.

## Read First

Before making changes, read the relevant docs:

| File                                               | Contents                                   |
| -------------------------------------------------- | ------------------------------------------ |
| [docs/agent-reference.md](docs/agent-reference.md) | Index + agent behavior summary             |
| [docs/architecture.md](docs/architecture.md)       | Packages, Controller API, dependency graph |
| [docs/plugin-system.md](docs/plugin-system.md)     | Plugin descriptor pattern                  |
| [docs/conventions.md](docs/conventions.md)         | Naming, build, Nx, Changesets, testing     |
| [docs/toolchain.md](docs/toolchain.md)             | Build stack, code generation, pre-commit   |

If any conflict exists, this file takes priority.

## Execution Rules

- Keep changes small and incremental.
- Preserve public API compatibility unless the task explicitly requires breaking changes.
- Respect dependency direction: `utils/types → core → plugins → framework wrappers`.
- Use generators for scaffolding (`nx g`, `pnpm create`, `pnpm init`, `pnpm create vite`). Do not hand-write `package.json`, `tsconfig`, `vite.config`, or Nx configs from scratch.

## Monorepo Conventions

- Tooling: `pnpm` workspaces + `Nx`.
- Internal deps use `"workspace:*"`.
- Each package exports public API from `src/index.ts`.
- Framework wrappers stay thin; core logic belongs in `core`.

## Quality Gates

- Run and pass relevant `lint` / `typecheck` / `test` targets for touched packages.
- Do not bypass git hooks (`--no-verify` is forbidden).
- Add or update tests for behavior changes when feasible.

## Versioning and Docs

- Use Changesets for logical changes; do not manually bump versions.
- Keep `docs/` and `README.md` up to date when behavior or API changes.
