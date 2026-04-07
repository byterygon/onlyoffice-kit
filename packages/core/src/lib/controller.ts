import type {
  EditorEventName,
  OnlyOfficeConfig,
  PluginContext,
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
  extractLayoutConfig,
  extractReloadConfig,
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
  private currentReloadConfigFingerprint: string;
  private currentLayoutFingerprint: string;
  private destroyed = false;
  private pluginEventHandlers: Array<
    (name: EditorEventName, payload?: unknown) => void
  > = [];
  private pluginDestroyCallbacks: Array<() => void> = [];

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

    this.link.on('ready', this.handleEditorReady as (payload: unknown) => void);
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
    this.currentReloadConfigFingerprint = JSON.stringify(
      extractReloadConfig(initialCoreConfig),
    );
    this.currentLayoutFingerprint = JSON.stringify(
      extractLayoutConfig(initialCoreConfig),
    );
    this.sendInit(initialCoreConfig);
  }

  setConfig(nextConfig: OnlyOfficeConfig): void {
    if (this.destroyed) return;

    this.currentConfig = nextConfig;

    const nextCoreConfig = stripEventHandlers(nextConfig);

    // Check reload-required fields (document, documentType, editorConfig, token, type).
    const nextReloadFingerprint = JSON.stringify(
      extractReloadConfig(nextCoreConfig),
    );
    if (nextReloadFingerprint !== this.currentReloadConfigFingerprint) {
      this.currentReloadConfigFingerprint = nextReloadFingerprint;
      this.currentLayoutFingerprint = JSON.stringify(
        extractLayoutConfig(nextCoreConfig),
      );
      this.sendRecreate(nextCoreConfig);
      return;
    }

    // Check layout-only fields (width, height) — no editor recreation needed.
    const nextLayoutFingerprint = JSON.stringify(
      extractLayoutConfig(nextCoreConfig),
    );
    if (nextLayoutFingerprint !== this.currentLayoutFingerprint) {
      this.currentLayoutFingerprint = nextLayoutFingerprint;
      this.sendUpdateLayout(extractLayoutConfig(nextCoreConfig));
    }
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    this.cleanupPlugins();
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

  private sendUpdateLayout(layout: { width?: string; height?: string }): void {
    this.link.emit('updateLayout', layout);
  }

  private handleEditorReady = (payload: {
    status: 'port-connected' | 'initialized';
  }): void => {
    if (payload.status === 'initialized') {
      this.setupPlugins();
    }
  };

  private handleEditorEvent = (payload: EditorEventPayload): void => {
    const eventName = payload.name;
    if (!isEditorEventName(eventName)) return;

    for (const handler of this.pluginEventHandlers) {
      handler(eventName, payload.payload);
    }

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

  private setupPlugins(): void {
    this.cleanupPlugins();

    for (const plugin of this.plugins) {
      const setup = (
        plugin as unknown as {
          _setup?: (ctx: PluginContext<unknown>) => void;
        }
      )._setup;
      if (!setup) continue;

      const destroyCallbacks: Array<() => void> = [];

      const ctx: PluginContext<unknown> = {
        options: plugin.options,
        onEditorEvent: (handler) => {
          this.pluginEventHandlers.push(handler);
          destroyCallbacks.push(() => {
            const idx = this.pluginEventHandlers.indexOf(handler);
            if (idx !== -1) this.pluginEventHandlers.splice(idx, 1);
          });
        },
        onDestroy: (cleanup) => {
          destroyCallbacks.push(cleanup);
        },
      };

      setup(ctx);
      this.pluginDestroyCallbacks.push(() => {
        for (const cb of destroyCallbacks) cb();
      });
    }
  }

  private cleanupPlugins(): void {
    for (const cb of this.pluginDestroyCallbacks) {
      cb();
    }
    this.pluginDestroyCallbacks = [];
    this.pluginEventHandlers = [];
  }

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
