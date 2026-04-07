import { definePlugin } from '@byterygon/onlyoffice-kit-utils';

/** Stable GUID for the companion OnlyOffice plugin. Use in the editor's pluginsData options. */
export const COPY_PASTE_PLUGIN_GUID =
  'asc.{7e2c9f1a-4b8d-3e5f-0a6c-1d9e2b7f4c8a}';

export interface CopyPastePluginOptions {
  enabled: boolean;
  /** BroadcastChannel name used to coordinate with the companion plugin iframe. */
  channelId: string;
}

export const CopyPastePlugin = definePlugin<CopyPastePluginOptions>({
  name: 'copy-paste',
  defaultOptions: { enabled: true, channelId: 'onlyoffice-kit-copy-paste' },
  setup(ctx) {
    if (!ctx.options.enabled) return;

    const channel = new BroadcastChannel(ctx.options.channelId);

    channel.addEventListener('message', (event: MessageEvent) => {
      if ((event.data as { type?: string } | null)?.type !== 'requestPaste')
        return;

      void (async () => {
        try {
          if (!navigator.clipboard?.read) {
            channel.postMessage({
              type: 'pasteError',
              message: 'Clipboard API not available',
            });
            return;
          }

          const items = await navigator.clipboard.read();
          let html = '';
          let text = '';

          for (const item of items) {
            if (item.types.includes('text/html') && !html) {
              const blob = await item.getType('text/html');
              html = await blob.text();
            } else if (item.types.includes('text/plain') && !text) {
              const blob = await item.getType('text/plain');
              text = await blob.text();
            }
          }

          channel.postMessage({ type: 'pasteData', html: html || text, text });
        } catch (error) {
          channel.postMessage({
            type: 'pasteError',
            message:
              error instanceof Error
                ? error.message
                : 'Clipboard access denied',
          });
        }
      })();
    });

    ctx.onDestroy(() => {
      channel.close();
    });
  },
});
