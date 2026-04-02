import type {
  EditorEventName,
  OnlyOfficeConfig,
  PluginDescriptor,
} from '@byterygon/onlyoffice-kit-types';
import { MsgLink } from '@byterygon/portex';
import type {
  CoreOnlyOfficeConfig,
  EditorErrorPayload,
  EditorEventPayload,
} from './protocol.js';
import {
  controllerDef,
  editorElementDef,
  isEditorEventName,
  stripEventHandlers,
} from './protocol.js';
import {
  EDITOR_ELEMENT_TAG,
  OnlyOfficeEditorElement,
  registerWebComponent,
} from './web-component.js';

export interface ControllerOptions {
  element: string | HTMLElement;
  config: OnlyOfficeConfig;
  documentServerUrl: string;
  plugins?: PluginDescriptor[];
}

export class Controller {
  private container: HTMLElement;
  private editorElement: OnlyOfficeEditorElement;
  private link: MsgLink<typeof controllerDef, typeof editorElementDef>;
  private plugins: PluginDescriptor[];
  private documentServerUrl: string;
  private currentConfig: OnlyOfficeConfig;
  private currentCoreConfigFingerprint: string;
  private destroyed = false;

  constructor(options: ControllerOptions) {
    const { element, config, documentServerUrl, plugins = [] } = options;

    const container =
      typeof element === 'string' ? document.querySelector(element) : element;

    if (!(container instanceof HTMLElement)) {
      throw new Error(
        `Controller: element "${String(element)}" not found in the DOM.`,
      );
    }

    this.container = container;
    registerWebComponent();
    this.plugins = plugins;
    this.documentServerUrl = documentServerUrl;
    this.currentConfig = config;

    const channel = new MessageChannel();
    this.link = new MsgLink(channel.port1, controllerDef);

    this.link.on(
      'editorEvent',
      this.handleEditorEvent as (payload: unknown) => void,
    );
    this.link.on(
      'editorError',
      this.handleEditorError as (payload: unknown) => void,
    );

    this.editorElement = document.createElement(
      EDITOR_ELEMENT_TAG,
    ) as OnlyOfficeEditorElement;
    this.editorElement.style.display = 'block';
    this.editorElement.style.width = '100%';
    this.editorElement.style.height = '100%';

    this.container.innerHTML = '';
    this.container.appendChild(this.editorElement);
    this.editorElement.attachPort(channel.port2);

    const initialCoreConfig = stripEventHandlers(config);
    this.currentCoreConfigFingerprint = JSON.stringify(initialCoreConfig);
    this.sendInit(initialCoreConfig);
  }

  setConfig(nextConfig: OnlyOfficeConfig): void {
    if (this.destroyed) return;

    this.currentConfig = nextConfig;

    const nextCoreConfig = stripEventHandlers(nextConfig);
    const nextCoreConfigFingerprint = JSON.stringify(nextCoreConfig);
    if (nextCoreConfigFingerprint === this.currentCoreConfigFingerprint) {
      return;
    }

    this.currentCoreConfigFingerprint = nextCoreConfigFingerprint;
    this.sendRecreate(nextCoreConfig);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    this.link.emit('destroy');
    this.link.destroy();
    this.editorElement.remove();
    this.container.innerHTML = '';
  }

  getPlugins(): PluginDescriptor[] {
    return [...this.plugins];
  }

  private sendInit(config: CoreOnlyOfficeConfig): void {
    this.link.emit('init', {
      documentServerUrl: this.documentServerUrl,
      config,
    });
  }

  private sendRecreate(config: CoreOnlyOfficeConfig): void {
    this.link.emit('recreate', {
      documentServerUrl: this.documentServerUrl,
      config,
    });
  }

  private handleEditorEvent = (payload: EditorEventPayload): void => {
    const eventName = payload.name;
    if (!isEditorEventName(eventName)) return;

    this.invokeConfiguredEvent(eventName, payload.payload);
  };

  private handleEditorError = (payload: EditorErrorPayload): void => {
    this.currentConfig.events?.onError?.({
      data: {
        errorCode: -1,
        errorDescription: payload.message,
      },
    });
  };

  private invokeConfiguredEvent(
    eventName: EditorEventName,
    payload: unknown,
  ): void {
    const handler = this.currentConfig.events?.[eventName];
    if (!handler) return;

    if (payload === undefined) {
      (handler as () => void)();
      return;
    }

    (handler as (eventPayload: unknown) => void)(payload);
  }
}
