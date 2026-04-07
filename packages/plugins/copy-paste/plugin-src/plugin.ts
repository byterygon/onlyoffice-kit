import { defineAscPlugin } from '@byterygon/onlyoffice-kit-plugin-sdk';

defineAscPlugin({
  init(channel, asc) {
    channel.addEventListener('message', (event: MessageEvent) => {
      const data = event.data as {
        type?: string;
        html?: string;
        text?: string;
      } | null;

      if (!data || data.type !== 'pasteData') return;

      if (data.html) {
        asc.plugin.executeMethod('PasteHtml', [data.html]);
      } else if (data.text) {
        asc.plugin.executeMethod('PasteText', [data.text]);
      }
    });
  },
});
