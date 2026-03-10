import type {
  DefinePluginInput,
  PluginDescriptor,
} from '@byterygon/onlyoffice-kit-types';

export function definePlugin<TOptions = unknown>(
  input: DefinePluginInput<TOptions>,
): PluginDescriptor<TOptions> {
  const { name, defaultOptions = {} as TOptions, setup } = input;

  function createDescriptor(options: TOptions): PluginDescriptor<TOptions> {
    return {
      name,
      options,
      configure(overrides: Partial<TOptions>) {
        return createDescriptor({ ...options, ...overrides });
      },
      extend(overrides) {
        return createDescriptor({
          ...options,
          ...overrides.options,
        } as TOptions);
      },
    };
  }

  const descriptor = createDescriptor(defaultOptions);

  if (setup) {
    Object.defineProperty(descriptor, '_setup', {
      value: setup,
      enumerable: false,
    });
  }

  return descriptor;
}
