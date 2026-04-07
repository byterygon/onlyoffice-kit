import { definePlugin } from '@byterygon/onlyoffice-kit-utils';

/** Stable GUID for the companion OnlyOffice plugin. Use in the editor's pluginsData options. */
export const BRIDGE_PLUGIN_GUID = 'asc.{3a6f4b2c-1d5e-4a9b-8c7f-2e0d1b3a5c9e}';

export interface BridgePluginOptions {
  channelId: string;
}

export const BridgePlugin = definePlugin<BridgePluginOptions>({
  name: 'bridge',
  defaultOptions: { channelId: 'onlyoffice-kit-bridge' },
  setup(ctx) {
    const channel = new BroadcastChannel(ctx.options.channelId);

    ctx.onEditorEvent((name, payload) => {
      channel.postMessage({ type: 'editorEvent', name, payload });
    });

    ctx.onDestroy(() => {
      channel.close();
    });
  },
});
