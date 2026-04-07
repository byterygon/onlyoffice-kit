import {
  defineAscPlugin,
  defineAscMethods,
} from '@byterygon/onlyoffice-kit-plugin-sdk';
import { MsgLink } from '@byterygon/portex';

// List Asc methods to expose to the main frame.
// Types are inferred from TextDocumentMethodMap — no stubs needed.
const bridgeDef = defineAscMethods([
  // example: 'GetFontList',
]);

defineAscPlugin({
  init(channel, _asc) {
    const link = new MsgLink(channel, bridgeDef);
    link.ready();
  },
});
