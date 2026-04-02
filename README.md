# onlyoffice-kit

A toolkit/SDK for working with [OnlyOffice](https://www.onlyoffice.com/). Wraps the OnlyOffice editor in Web Components and provides a clean Controller API, typed definitions, and framework integrations.

## Packages

| Package                                       | Description                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `@byterygon/onlyoffice-kit-core`              | Controller + Web Component wrapper for the OnlyOffice editor               |
| `@byterygon/onlyoffice-kit-types`             | Type-safe definitions for configuration, events, messages, and plugin APIs |
| `@byterygon/onlyoffice-kit-utils`             | Shared utilities                                                           |
| `@byterygon/onlyoffice-kit-plugin-bridge`     | MessageChannel bridge for invoking plugin APIs from the main frame         |
| `@byterygon/onlyoffice-kit-plugin-copy-paste` | Context-menu paste support via the Clipboard API                           |
| `@byterygon/onlyoffice-kit-react`             | React wrapper                                                              |
| `@byterygon/onlyoffice-kit-vue`               | Vue wrapper                                                                |
| `@byterygon/onlyoffice-kit-angular`           | Angular wrapper                                                            |

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## Basic Usage

```ts
import { Controller } from '@byterygon/onlyoffice-kit-core';

const controller = new Controller({
  element: '#editor',
  documentServerUrl: 'http://documentserver/',
  config: {
    document: {
      fileType: 'docx',
      key: 'doc-key',
      title: 'Example.docx',
      url: 'https://example.com/document.docx',
    },
    documentType: 'word',
    editorConfig: {
      callbackUrl: 'https://example.com/callback',
    },
    events: {
      onDocumentReady: () => {
        console.log('Editor ready');
      },
    },
  },
});

// Runtime update policy:
// - events-only change -> callback pointers are updated in place.
// - core config change -> editor is recreated.
controller.setConfig({
  ...nextConfig,
});
```

## Author's Note

This project is vibe-coded with Codex and Claude, but the core design decisions — the Web Component isolation approach, the Controller API pattern, and the use of BroadcastChannel for plugin-to-main-frame communication — originate from the author's own experience and hands-on experimentation with the OnlyOffice SDK. AI accelerates development, tightens every line of code, and serves as a sounding board for design decisions. All code and documentation in this project have been reviewed and approved by the author.

## License

MIT
