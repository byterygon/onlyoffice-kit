import { definePlugin } from '@byterygon/onlyoffice-kit-utils';

export interface CopyPastePluginOptions {
  enabled: boolean;
}

export const CopyPastePlugin = definePlugin<CopyPastePluginOptions>({
  name: 'copy-paste',
  defaultOptions: { enabled: true },
});
