import type { OnlyOfficeConfig } from '@byterygon/onlyoffice-kit-types';
import { MsgLink } from '@byterygon/portex';
import { Controller } from './controller.js';
import { controllerDef, editorElementDef } from './protocol.js';

const ORIGINAL_ELEMENT = customElements.get('onlyoffice-editor');
const HOST_ID = 'editor-host';

class MockOnlyOfficeEditorElement extends HTMLElement {
  static instances: MockOnlyOfficeEditorElement[] = [];
  static commands: { name: string; payload: unknown }[] = [];

  private link: MsgLink<typeof editorElementDef, typeof controllerDef> | null =
    null;

  constructor() {
    super();
    MockOnlyOfficeEditorElement.instances.push(this);
  }

  attachPort(port: MessagePort): void {
    this.link = new MsgLink(port, editorElementDef);

    this.link.on('init', (payload: unknown) => {
      MockOnlyOfficeEditorElement.commands.push({ name: 'init', payload });
    });
    this.link.on('recreate', (payload: unknown) => {
      MockOnlyOfficeEditorElement.commands.push({ name: 'recreate', payload });
    });
    this.link.on('destroy', () => {
      MockOnlyOfficeEditorElement.commands.push({
        name: 'destroy',
        payload: undefined,
      });
    });
  }

  emitToController(eventName: string, payload?: unknown): void {
    if (eventName === 'editorEvent') {
      this.link?.emit(
        'editorEvent',
        payload as { name: never; payload?: unknown },
      );
    } else if (eventName === 'editorError') {
      this.link?.emit(
        'editorError',
        payload as { code: string; message: string },
      );
    } else if (eventName === 'ready') {
      this.link?.emit(
        'ready',
        payload as { status: 'port-connected' | 'initialized' },
      );
    }
  }

  static reset(): void {
    MockOnlyOfficeEditorElement.instances = [];
    MockOnlyOfficeEditorElement.commands = [];
  }
}

if (!ORIGINAL_ELEMENT) {
  customElements.define('onlyoffice-editor', MockOnlyOfficeEditorElement);
}

function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function createConfig(
  events?: OnlyOfficeConfig['events'],
  title = 'Test document.docx',
): OnlyOfficeConfig {
  return {
    document: {
      fileType: 'docx',
      key: 'doc-key',
      title,
      url: 'https://example.com/doc.docx',
    },
    documentType: 'word',
    editorConfig: {
      callbackUrl: 'https://example.com/callback',
    },
    events,
  };
}

describe('Controller', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="${HOST_ID}"></div>`;
    MockOnlyOfficeEditorElement.reset();
  });

  it('should throw when element is not found', () => {
    expect(
      () =>
        new Controller({
          element: '#nonexistent',
          config: createConfig(),
          documentServerUrl: 'http://localhost',
        }),
    ).toThrow('not found');
  });

  it('should mount web component and send init command', async () => {
    new Controller({
      element: `#${HOST_ID}`,
      config: createConfig(),
      documentServerUrl: 'http://documentserver',
    });

    await nextTick();

    expect(
      document.querySelector(`#${HOST_ID}`)?.querySelector('onlyoffice-editor'),
    ).toBeTruthy();

    expect(MockOnlyOfficeEditorElement.commands).toContainEqual({
      name: 'init',
      payload: {
        documentServerUrl: 'http://documentserver',
        config: {
          document: {
            fileType: 'docx',
            key: 'doc-key',
            title: 'Test document.docx',
            url: 'https://example.com/doc.docx',
          },
          documentType: 'word',
          editorConfig: {
            callbackUrl: 'https://example.com/callback',
          },
          height: undefined,
          token: undefined,
          type: undefined,
          width: undefined,
        },
      },
    });
  });

  it('should not recreate editor when only events change', async () => {
    const onDocumentReadyA = vi.fn();
    const onDocumentReadyB = vi.fn();

    const controller = new Controller({
      element: `#${HOST_ID}`,
      config: createConfig({ onDocumentReady: onDocumentReadyA }),
      documentServerUrl: 'http://documentserver',
    });

    await nextTick();
    MockOnlyOfficeEditorElement.commands = [];

    controller.setConfig(createConfig({ onDocumentReady: onDocumentReadyB }));
    await nextTick();

    expect(MockOnlyOfficeEditorElement.commands).not.toContainEqual(
      expect.objectContaining({ name: 'recreate' }),
    );
  });

  it('should recreate editor when core config changes', async () => {
    const controller = new Controller({
      element: `#${HOST_ID}`,
      config: createConfig(),
      documentServerUrl: 'http://documentserver',
    });

    await nextTick();
    MockOnlyOfficeEditorElement.commands = [];

    controller.setConfig(createConfig(undefined, 'Changed title.docx'));
    await nextTick();

    expect(MockOnlyOfficeEditorElement.commands).toContainEqual({
      name: 'recreate',
      payload: {
        documentServerUrl: 'http://documentserver',
        config: {
          document: {
            fileType: 'docx',
            key: 'doc-key',
            title: 'Changed title.docx',
            url: 'https://example.com/doc.docx',
          },
          documentType: 'word',
          editorConfig: {
            callbackUrl: 'https://example.com/callback',
          },
          height: undefined,
          token: undefined,
          type: undefined,
          width: undefined,
        },
      },
    });
  });

  it('should invoke full typed event handlers from bridge messages', async () => {
    const onDocumentReady = vi.fn();
    const onDocumentStateChange = vi.fn();

    new Controller({
      element: `#${HOST_ID}`,
      config: createConfig({
        onDocumentReady,
        onDocumentStateChange,
      }),
      documentServerUrl: 'http://documentserver',
    });

    await nextTick();

    const editorElement = MockOnlyOfficeEditorElement.instances[0];
    editorElement.emitToController('editorEvent', { name: 'onDocumentReady' });
    editorElement.emitToController('editorEvent', {
      name: 'onDocumentStateChange',
      payload: { data: true },
    });

    await nextTick();

    expect(onDocumentReady).toHaveBeenCalledTimes(1);
    expect(onDocumentStateChange).toHaveBeenCalledWith({ data: true });
  });

  it('should send destroy command and cleanup on destroy', async () => {
    const controller = new Controller({
      element: `#${HOST_ID}`,
      config: createConfig(),
      documentServerUrl: 'http://documentserver',
    });

    await nextTick();
    MockOnlyOfficeEditorElement.commands = [];

    controller.destroy();
    await nextTick();

    expect(MockOnlyOfficeEditorElement.commands).toContainEqual({
      name: 'destroy',
      payload: undefined,
    });
    expect(document.querySelector(`#${HOST_ID}`)?.innerHTML).toBe('');
  });

  it('should forward editorError to onError callback', async () => {
    const onError = vi.fn();

    new Controller({
      element: `#${HOST_ID}`,
      config: createConfig({ onError }),
      documentServerUrl: 'http://documentserver',
    });

    await nextTick();

    const editorElement = MockOnlyOfficeEditorElement.instances[0];
    editorElement.emitToController('editorError', {
      code: 'DOCS_API_LOAD_FAILED',
      message: 'Unable to load DocsAPI script',
    });

    await nextTick();

    expect(onError).toHaveBeenCalledWith({
      data: {
        errorCode: -1,
        errorDescription: 'Unable to load DocsAPI script',
      },
    });
  });

  it('should use latest callback reference when events are updated frequently', async () => {
    const initialHandler = vi.fn();
    const latestHandler = vi.fn();

    const controller = new Controller({
      element: `#${HOST_ID}`,
      config: createConfig({ onDocumentReady: initialHandler }),
      documentServerUrl: 'http://documentserver',
    });

    controller.setConfig(createConfig({ onDocumentReady: vi.fn() }));
    controller.setConfig(createConfig({ onDocumentReady: vi.fn() }));
    controller.setConfig(createConfig({ onDocumentReady: latestHandler }));

    await nextTick();

    const editorElement = MockOnlyOfficeEditorElement.instances[0];
    editorElement.emitToController('editorEvent', { name: 'onDocumentReady' });
    await nextTick();

    expect(initialHandler).not.toHaveBeenCalled();
    expect(latestHandler).toHaveBeenCalledTimes(1);
  });
});
