import { Asc, TextDocumentMethodMap } from './asc-types.js';
import { defineLink } from '@byterygon/portex';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

type AscMethodFns = {
  [K in keyof TextDocumentMethodMap]: (
    ...args: TextDocumentMethodMap[K]['args']
  ) => TextDocumentMethodMap[K]['result'];
};

type ToPortexProcedures<T extends Record<string, AnyFn>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
};

/**
 * Declare a typed Asc method bridge by listing method names from TextDocumentMethodMap.
 * Returns a portex LinkDefinition where each procedure wraps Asc.plugin.executeMethod.
 *
 * @example
 * const bridgeDef = defineAscMethods(['PasteHtml', 'GetFontList']);
 */
export function defineAscMethods<K extends keyof TextDocumentMethodMap>(
  methods: K[],
): ReturnType<
  typeof defineLink<{ procedures: ToPortexProcedures<Pick<AscMethodFns, K>> }>
> {
  const procedures: Record<string, AnyFn> = {};

  for (const name of methods) {
    procedures[name as string] = (...allArgs: unknown[]) => {
      // portex injects ProcedureContext as last arg — strip it before forwarding to Asc
      const userArgs = allArgs.slice(0, -1);
      return new Promise<unknown>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Asc.plugin.executeMethod(name, userArgs as any, (result) =>
          resolve(result),
        );
      });
    };
  }

  return defineLink({
    procedures: procedures as ToPortexProcedures<Pick<AscMethodFns, K>>,
  }) as ReturnType<
    typeof defineLink<{ procedures: ToPortexProcedures<Pick<AscMethodFns, K>> }>
  >;
}
