# onlyoffice-kit

A toolkit/SDK for working with [OnlyOffice](https://www.onlyoffice.com/). Wraps the OnlyOffice editor in Web Components and provides a clean Controller API, typed definitions, and framework integrations.

## Packages

| Package | Description |
|---------|-------------|
| `@byterygon/onlyoffice-kit-core` | Controller + Web Component wrapper for the OnlyOffice editor |
| `@byterygon/onlyoffice-kit-types` | Type-safe definitions for configuration, events, messages, and plugin APIs |
| `@byterygon/onlyoffice-kit-utils` | Shared utilities |
| `@byterygon/onlyoffice-kit-plugin-bridge` | MessageChannel bridge for invoking plugin APIs from the main frame |
| `@byterygon/onlyoffice-kit-plugin-copy-paste` | Context-menu paste support via the Clipboard API |
| `@byterygon/onlyoffice-kit-react` | React wrapper |
| `@byterygon/onlyoffice-kit-vue` | Vue wrapper |
| `@byterygon/onlyoffice-kit-angular` | Angular wrapper |

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
