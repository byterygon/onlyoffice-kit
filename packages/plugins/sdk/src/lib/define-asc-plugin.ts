import { Asc, type AscInstance } from './asc-types.js';

export interface AscPluginConfig {
  init: (channel: BroadcastChannel, asc: AscInstance) => void;
  button?: () => void;
}

export function defineAscPlugin(config: AscPluginConfig): void {
  Asc.plugin.init = function () {
    const channelId = Asc.plugin.cfg?.channelId;
    if (!channelId)
      throw new Error('[plugin-sdk] channelId is required in Asc.plugin.cfg');
    config.init(new BroadcastChannel(channelId), Asc);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Asc.plugin.button = config.button ?? function () {};
}
