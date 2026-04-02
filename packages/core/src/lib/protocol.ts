import type {
  EditorEventName,
  OnlyOfficeConfig,
} from '@byterygon/onlyoffice-kit-types';
import { defineLink } from '@byterygon/portex';

export type CoreOnlyOfficeConfig = Omit<OnlyOfficeConfig, 'events'>;

export interface EditorInitPayload {
  documentServerUrl: string;
  config: CoreOnlyOfficeConfig;
}

export interface EditorEventPayload {
  name: EditorEventName;
  payload?: unknown;
}

export interface EditorErrorPayload {
  code: string;
  message: string;
}

/**
 * Link definition for the editor element (web component) side.
 * Declares events the element emits toward the controller.
 */
export const editorElementDef = defineLink({
  on: {
    // Emitted after port attachment and after editor initialization.
    // The controller does not currently act on these signals — they are
    // available for future readiness-gating logic.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    ready: (_payload: { status: 'port-connected' | 'initialized' }) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    editorEvent: (_payload: EditorEventPayload) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    editorError: (_payload: EditorErrorPayload) => {},
  },
});

/**
 * Link definition for the controller side.
 * Declares events the controller emits toward the element.
 */
export const controllerDef = defineLink({
  on: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    init: (_payload: EditorInitPayload) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    recreate: (_payload: EditorInitPayload) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy: () => {},
  },
});

export const EDITOR_EVENT_NAMES = [
  'onAppReady',
  'onCollaborativeChanges',
  'onDocumentReady',
  'onDocumentStateChange',
  'onDownloadAs',
  'onError',
  'onInfo',
  'onMakeActionLink',
  'onMetaChange',
  'onOutdatedVersion',
  'onPluginsReady',
  'onRequestClose',
  'onRequestCompareFile',
  'onRequestCreateNew',
  'onRequestEditRights',
  'onRequestHistory',
  'onRequestHistoryClose',
  'onRequestHistoryData',
  'onRequestInsertImage',
  'onRequestMailMergeRecipients',
  'onRequestOpen',
  'onRequestReferenceData',
  'onRequestReferenceSource',
  'onRequestRefreshFile',
  'onRequestRename',
  'onRequestRestore',
  'onRequestSaveAs',
  'onRequestSelectDocument',
  'onRequestSelectSpreadsheet',
  'onRequestSendNotify',
  'onRequestSharingSettings',
  'onRequestStartFilling',
  'onRequestUsers',
  'onSubmit',
  'onUserActionRequired',
  'onWarning',
] as const satisfies readonly EditorEventName[];

const EDITOR_EVENT_NAME_SET = new Set<EditorEventName>(EDITOR_EVENT_NAMES);

export function isEditorEventName(value: unknown): value is EditorEventName {
  return (
    typeof value === 'string' &&
    EDITOR_EVENT_NAME_SET.has(value as EditorEventName)
  );
}

// Keep in sync with OnlyOfficeConfig minus 'events'.
export function stripEventHandlers(
  config: OnlyOfficeConfig,
): CoreOnlyOfficeConfig {
  return {
    document: config.document,
    documentType: config.documentType,
    editorConfig: config.editorConfig,
    height: config.height,
    token: config.token,
    type: config.type,
    width: config.width,
  };
}
