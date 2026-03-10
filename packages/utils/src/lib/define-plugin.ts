import type {
  DefinePluginInput,
  PluginDescriptor,
} from '@byterygon/onlyoffice-kit-types';

export function definePlugin<TOptions = unknown>(
  input: DefinePluginInput<TOptions>,
): PluginDescriptor<TOptions> {
  const { name: baseName, defaultOptions = {} as TOptions, setup } = input;

  function createDescriptor(
    descriptorName: string,
    options: TOptions,
  ): PluginDescriptor<TOptions> {
    const descriptor: PluginDescriptor<TOptions> = {
      name: descriptorName,
      options,
      configure(overrides: Partial<TOptions>) {
        return createDescriptor(descriptorName, { ...options, ...overrides });
      },
      extend(
        overrides: Partial<
          Omit<PluginDescriptor<TOptions>, 'configure' | 'extend'>
        >,
      ) {
        return createDescriptor(overrides.name ?? descriptorName, {
          ...options,
          ...overrides.options,
        } as TOptions);
      },
    };

    if (setup) {
      Object.defineProperty(descriptor, '_setup', {
        value: setup,
        enumerable: false,
      });
    }

    return descriptor;
  }

  return createDescriptor(baseName, defaultOptions);
}
