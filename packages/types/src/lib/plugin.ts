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
  setup?: (options: TOptions) => void;
}
