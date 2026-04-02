export { Controller } from './controller.js';
export type { ControllerOptions } from './controller.js';
export {
  OnlyOfficeEditorElement,
  registerWebComponent,
} from './web-component.js';

// Re-export types so consumers only need to install core
export type {
  DocumentConfig,
  EditorConfig,
  OnlyOfficeConfig,
  EditorEventName,
  EditorEvent,
  EditorMessage,
  CommandMessage,
  EventMessage,
  PluginDescriptor,
  DefinePluginInput,
} from '@byterygon/onlyoffice-kit-types';

// Re-export utils
export { definePlugin, uid } from '@byterygon/onlyoffice-kit-utils';
