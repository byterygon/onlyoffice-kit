import type { EditorEventName } from './events.js';

export interface PluginContext<TOptions = unknown> {
  /** The resolved options for this plugin instance. */
  options: TOptions;
  /**
   * Register a handler that fires for every editor event.
   * The handler is automatically removed when the plugin is destroyed.
   */
  onEditorEvent(
    handler: (name: EditorEventName, payload?: unknown) => void,
  ): void;
  /** Register a cleanup callback that runs when the plugin is torn down. */
  onDestroy(cleanup: () => void): void;
}

export interface PluginDescriptor<TOptions = unknown> {
  name: string;
  options: TOptions;
  configure(options: Partial<TOptions>): PluginDescriptor<TOptions>;
  extend(
    overrides: Partial<
      Omit<PluginDescriptor<TOptions>, 'configure' | 'extend'>
    >,
  ): PluginDescriptor<TOptions>;
}

export interface DefinePluginInput<TOptions = unknown> {
  name: string;
  defaultOptions?: TOptions;
  setup?: (ctx: PluginContext<TOptions>) => void;
}
