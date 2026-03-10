import { definePlugin, uid } from '@byterygon/onlyoffice-kit-utils';

export interface BridgePluginOptions {
  channelId: string;
}

export const BridgePlugin = definePlugin<BridgePluginOptions>({
  name: 'bridge',
  defaultOptions: { channelId: uid('bridge') },
});
