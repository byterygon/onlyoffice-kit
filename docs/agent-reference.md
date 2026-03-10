# Agent Reference

Detailed coding-agent guide for the `onlyoffice-kit` repository.

For quick rules, see the root [`AGENTS.md`](../AGENTS.md).

## Documentation Index

| Document                             | Contents                                                               |
| ------------------------------------ | ---------------------------------------------------------------------- |
| [architecture.md](architecture.md)   | Project overview, packages, Controller API, dependency direction       |
| [plugin-system.md](plugin-system.md) | Plugin descriptor pattern: `definePlugin`, `.configure()`, `.extend()` |
| [conventions.md](conventions.md)     | Naming, build output, workspace deps, Nx tasks, Changesets, testing    |
| [toolchain.md](toolchain.md)         | Build stack, code generation rules, pre-commit hooks                   |

## Agent Behavior Summary

1. **Read docs first** — Start with this index, then read relevant detail pages before making changes.
2. **Small changes** — Prefer incremental edits over large rewrites.
3. **API stability** — Breaking changes require a major version bump via Changesets.
4. **Package boundaries** — Core logic in `core`; framework wrappers stay thin. Follow dependency direction: `utils/types → core → plugins → framework wrappers`.
5. **Use generators** — Scaffold with `nx g`, `pnpm create`, `pnpm init`. Never hand-write boilerplate configs.
6. **Never bypass hooks** — `--no-verify` is forbidden.
7. **Test your changes** — Run relevant `lint`, `typecheck`, `test` targets for touched packages.
8. **Update docs** — Keep `docs/` and `README.md` in sync when behavior or API changes.
