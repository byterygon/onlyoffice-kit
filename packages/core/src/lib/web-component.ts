import type { EditorEventName } from '@byterygon/onlyoffice-kit-types';
import { MsgLink } from '@byterygon/portex';
import { EDITOR_EVENT_NAMES } from './protocol.js';
import type { EditorInitPayload } from './protocol.js';
import { controllerDef, editorElementDef } from './protocol.js';

export const EDITOR_ELEMENT_TAG = 'onlyoffice-editor';
const DOCS_API_SCRIPT_ID = 'onlyoffice-docs-api-script';

interface DocEditorInstance {
  destroyEditor?: () => void;
}

interface DocsApi {
  DocEditor: (id: string, config: Record<string, unknown>) => DocEditorInstance;
}

declare global {
  interface Window {
    DocsAPI?: DocsApi;
    DocEditor?: {
      instances: Record<string, DocEditorInstance | undefined>;
    };
  }
}

let elementCounter = 0;

export class OnlyOfficeEditorElement extends HTMLElement {
  private static docsApiLoadPromise: Promise<void> | null = null;
  private static docsApiScriptUrl: string | null = null;

  private link: MsgLink<typeof editorElementDef, typeof controllerDef> | null =
    null;
  private editorHost: HTMLDivElement | null = null;
  private editorHostId = `onlyoffice-editor-host-${++elementCounter}`;
  private editorInstance: DocEditorInstance | null = null;

  connectedCallback(): void {
    this.ensureEditorHost();
  }

  disconnectedCallback(): void {
    this.destroyEditor();
    this.link?.destroy();
    this.link = null;
    this.editorHost?.remove();
    this.editorHost = null;
  }

  attachPort(port: MessagePort): void {
    this.link = new MsgLink(port, editorElementDef);

    this.link.on('init', (payload: unknown) => {
      void this.initOrRecreateEditor(payload as EditorInitPayload);
    });
    this.link.on('recreate', (payload: unknown) => {
      void this.initOrRecreateEditor(payload as EditorInitPayload);
    });
    this.link.on('destroy', () => {
      this.destroyEditor();
    });

    this.link.emit('ready', { status: 'port-connected' });
  }

  private ensureEditorHost(): void {
    if (this.editorHost) return;

    this.style.display = 'block';
    if (!this.style.width) this.style.width = '100%';
    if (!this.style.height) this.style.height = '100%';

    const host = document.createElement('div');
    host.id = this.editorHostId;
    host.style.width = '100%';
    host.style.height = '100%';
    this.appendChild(host);
    this.editorHost = host;
  }

  private async initOrRecreateEditor(
    payload: EditorInitPayload | undefined,
  ): Promise<void> {
    if (!isValidInitPayload(payload)) {
      this.link?.emit('editorError', {
        code: 'INVALID_INIT_PAYLOAD',
        message: 'Invalid editor initialization payload',
      });
      return;
    }

    this.ensureEditorHost();

    try {
      await this.loadDocsApi(payload.documentServerUrl);
    } catch (error) {
      this.link?.emit('editorError', {
        code: 'DOCS_API_LOAD_FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to load DocsAPI script',
      });
      return;
    }

    if (!window.DocsAPI || typeof window.DocsAPI.DocEditor !== 'function') {
      this.link?.emit('editorError', {
        code: 'DOCS_API_MISSING',
        message: 'DocsAPI is not defined',
      });
      return;
    }

    this.destroyEditor();

    const initConfig: Record<string, unknown> = {
      ...payload.config,
      events: this.createEditorEvents(),
    };

    this.editorInstance = window.DocsAPI.DocEditor(
      this.editorHostId,
      initConfig,
    );
    window.DocEditor = window.DocEditor ?? { instances: {} };
    window.DocEditor.instances[this.editorHostId] = this.editorInstance;

    this.link?.emit('ready', { status: 'initialized' });
  }

  private createEditorEvents(): Record<
    EditorEventName,
    (payload?: unknown) => void
  > {
    const handlers = {} as Record<EditorEventName, (payload?: unknown) => void>;
    for (const name of EDITOR_EVENT_NAMES) {
      handlers[name] = (payload?: unknown) => {
        this.link?.emit('editorEvent', { name, payload });
      };
    }
    return handlers;
  }

  private destroyEditor(): void {
    if (this.editorInstance?.destroyEditor) {
      this.editorInstance.destroyEditor();
    }

    this.editorInstance = null;
    if (window.DocEditor?.instances) {
      delete window.DocEditor.instances[this.editorHostId];
    }

    if (this.editorHost) {
      this.editorHost.innerHTML = '';
    }
  }

  private loadDocsApi(documentServerUrl: string): Promise<void> {
    if (window.DocsAPI) {
      return Promise.resolve();
    }

    const docsApiUrl = buildDocsApiUrl(documentServerUrl);
    if (
      OnlyOfficeEditorElement.docsApiLoadPromise &&
      OnlyOfficeEditorElement.docsApiScriptUrl === docsApiUrl
    ) {
      return OnlyOfficeEditorElement.docsApiLoadPromise;
    }

    const existingScript = document.getElementById(DOCS_API_SCRIPT_ID);
    if (existingScript && !window.DocsAPI) {
      existingScript.remove();
    }

    OnlyOfficeEditorElement.docsApiScriptUrl = docsApiUrl;
    OnlyOfficeEditorElement.docsApiLoadPromise = new Promise<void>(
      (resolve, reject) => {
        const script = document.createElement('script');
        script.id = DOCS_API_SCRIPT_ID;
        script.type = 'text/javascript';
        script.src = docsApiUrl;
        script.async = true;

        script.onload = () => {
          if (window.DocsAPI) {
            resolve();
            return;
          }
          reject(new Error('DocsAPI is not defined'));
        };

        script.onerror = () => {
          reject(new Error(`Unable to load DocsAPI script: ${docsApiUrl}`));
        };

        document.body.appendChild(script);
      },
    ).catch((error) => {
      OnlyOfficeEditorElement.docsApiLoadPromise = null;
      OnlyOfficeEditorElement.docsApiScriptUrl = null;
      throw error;
    });

    return OnlyOfficeEditorElement.docsApiLoadPromise;
  }
}

export function registerWebComponent(): void {
  if (!customElements.get(EDITOR_ELEMENT_TAG)) {
    customElements.define(EDITOR_ELEMENT_TAG, OnlyOfficeEditorElement);
  }
}

function buildDocsApiUrl(documentServerUrl: string): string {
  const serverUrl = documentServerUrl.endsWith('/')
    ? documentServerUrl
    : `${documentServerUrl}/`;
  return `${serverUrl}web-apps/apps/api/documents/api.js`;
}

function isValidInitPayload(payload: unknown): payload is EditorInitPayload {
  if (!payload || typeof payload !== 'object') return false;

  const initPayload = payload as Partial<EditorInitPayload>;
  return (
    typeof initPayload.documentServerUrl === 'string' &&
    !!initPayload.config &&
    typeof initPayload.config === 'object'
  );
}
