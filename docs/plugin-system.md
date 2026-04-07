# Plugin Descriptor System

Plugins follow a **descriptor pattern** inspired by Tiptap. Users do not instantiate plugins directly — the Controller handles lifecycle internally.

## Defining a Plugin

Plugin authors use `definePlugin()` to create a descriptor:

```ts
const BridgePlugin = definePlugin({
  name: 'bridge',
  // ...plugin capabilities
});
```

`definePlugin()` returns a descriptor object, not an instance.

## Configuring a Plugin

Users configure plugins via `.configure()`, which returns a new descriptor with overridden options:

```ts
BridgePlugin.configure({
  /* options */
});
```

## Extending a Plugin

`.extend()` creates a derived descriptor, inheriting the base and overriding specific fields:

```ts
const CustomBridge = BridgePlugin.extend({
  name: 'custom-bridge',
  // ...overrides
});
```

## Usage with Controller

Configured plugin descriptors are passed to the Controller:

```ts
const editor = new Controller({
  element: '#editor',
  plugins: [
    BridgePlugin.configure({
      /* options */
    }),
    CopyPastePlugin.configure({
      /* options */
    }),
  ],
});
```

## Rules

- `definePlugin()` → returns a descriptor
- `.configure(options)` → returns a new descriptor with merged options
- `.extend(overrides)` → returns a derived descriptor
- Instantiation and lifecycle are handled internally by `Controller`
- Plugin authors define capabilities; consumers only configure and pass descriptors

---

## Iframe Plugin SDK

Distinct from the Controller-level `definePlugin`, OnlyOffice plugins also run in an **iframe context** managed by OnlyOffice itself. The `plugin-sdk` package provides helpers for that layer.

### defineAscPlugin

Wraps the OnlyOffice plugin iframe lifecycle. The `init` callback receives a `BroadcastChannel` (for Portex messaging to the main frame) and the `Asc` instance:

```ts
import {
  defineAscPlugin,
  defineAscMethods,
} from '@byterygon/onlyoffice-kit-plugin-sdk';
import { MsgLink } from '@byterygon/portex';

const bridgeDef = defineAscMethods(['GetFontList', 'PasteHtml']);

defineAscPlugin({
  init(channel, _asc) {
    const link = new MsgLink(channel, bridgeDef);
    link.ready();
  },
});
```

### defineAscMethods

Accepts an array of method names from `TextDocumentMethodMap` and returns a Portex `LinkDefinition`. Each method becomes a typed RPC procedure that wraps `Asc.plugin.executeMethod`.

- Types are inferred from `TextDocumentMethodMap` — no manual stubs needed
- The `BroadcastChannel` from `defineAscPlugin` connects this definition to the main frame via the bridge plugin
