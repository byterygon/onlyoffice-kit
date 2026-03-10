import type {
  OnlyOfficeConfig,
  PluginDescriptor,
} from '@byterygon/onlyoffice-kit-types';
import { registerWebComponent } from './web-component.js';
import { EditorMessageChannel } from './message-channel.js';

export interface ControllerOptions {
  element: string | HTMLElement;
  config: OnlyOfficeConfig;
  documentServerUrl: string;
  plugins?: PluginDescriptor[];
}

export class Controller {
  private container: HTMLElement;
  private messageChannel: EditorMessageChannel;
  private plugins: PluginDescriptor[];

  constructor(options: ControllerOptions) {
    const { element, plugins = [] } = options;

    this.container =
      typeof element === 'string'
        ? (document.querySelector(element) as HTMLElement)
        : element;

    if (!this.container) {
      throw new Error(
        `Controller: element "${String(element)}" not found in the DOM.`,
      );
    }

    registerWebComponent();
    this.messageChannel = new EditorMessageChannel();
    this.plugins = plugins;
  }

  destroy(): void {
    this.messageChannel.destroy();
    this.container.innerHTML = '';
  }

  getPlugins(): PluginDescriptor[] {
    return [...this.plugins];
  }
}
