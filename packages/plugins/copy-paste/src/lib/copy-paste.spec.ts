import type { PluginContext } from '@byterygon/onlyoffice-kit-types';
import { COPY_PASTE_PLUGIN_GUID, CopyPastePlugin } from './copy-paste.js';
import type { CopyPastePluginOptions } from './copy-paste.js';

describe('CopyPastePlugin', () => {
  it('should have correct name', () => {
    expect(CopyPastePlugin.name).toBe('copy-paste');
  });

  it('should default to enabled', () => {
    expect(CopyPastePlugin.options.enabled).toBe(true);
  });

  it('should default to the stable well-known channelId', () => {
    expect(CopyPastePlugin.options.channelId).toBe('onlyoffice-kit-copy-paste');
  });

  it('should export the companion plugin GUID', () => {
    expect(COPY_PASTE_PLUGIN_GUID).toBe(
      'asc.{7e2c9f1a-4b8d-3e5f-0a6c-1d9e2b7f4c8a}',
    );
  });

  it('should have a setup function', () => {
    const descriptor = CopyPastePlugin as unknown as {
      _setup?: (ctx: PluginContext<unknown>) => void;
    };
    expect(typeof descriptor._setup).toBe('function');
  });

  it('should not open a channel when disabled', () => {
    const MockBroadcastChannel = vi.fn(function MockBC() {
      return {
        close: vi.fn(),
        addEventListener: vi.fn(),
        postMessage: vi.fn(),
      };
    });
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);

    const ctx: PluginContext<CopyPastePluginOptions> = {
      options: { enabled: false, channelId: 'test' },
      onEditorEvent: vi.fn(),
      onDestroy: vi.fn(),
    };

    const descriptor = CopyPastePlugin as unknown as {
      _setup: (ctx: PluginContext<CopyPastePluginOptions>) => void;
    };
    descriptor._setup(ctx);

    expect(BroadcastChannel).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('should open and close a BroadcastChannel when enabled', () => {
    const closeSpy = vi.fn();
    const MockBroadcastChannel = vi.fn(function MockBC() {
      return {
        close: closeSpy,
        addEventListener: vi.fn(),
        postMessage: vi.fn(),
      };
    });
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);

    const destroyCallbacks: Array<() => void> = [];
    const ctx: PluginContext<CopyPastePluginOptions> = {
      options: { enabled: true, channelId: 'cp-test' },
      onEditorEvent: vi.fn(),
      onDestroy: (cb) => destroyCallbacks.push(cb),
    };

    const descriptor = CopyPastePlugin as unknown as {
      _setup: (ctx: PluginContext<CopyPastePluginOptions>) => void;
    };
    descriptor._setup(ctx);

    expect(BroadcastChannel).toHaveBeenCalledWith('cp-test');
    for (const cb of destroyCallbacks) cb();
    expect(closeSpy).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('should respond to requestPaste with clipboard data', async () => {
    const mockHtmlBlob = new Blob(['<b>Hello</b>'], { type: 'text/html' });
    const mockTextBlob = new Blob(['Hello'], { type: 'text/plain' });
    vi.stubGlobal('navigator', {
      clipboard: {
        read: vi.fn().mockResolvedValue([
          {
            types: ['text/html', 'text/plain'],
            getType: (type: string) =>
              type === 'text/html'
                ? Promise.resolve(mockHtmlBlob)
                : Promise.resolve(mockTextBlob),
          },
        ]),
      },
    });

    const postMessageSpy = vi.fn();
    let messageHandler: ((event: MessageEvent) => void) | undefined;
    vi.stubGlobal(
      'BroadcastChannel',
      vi.fn(function MockBC() {
        return {
          close: vi.fn(),
          postMessage: postMessageSpy,
          addEventListener: (_: string, handler: (e: MessageEvent) => void) => {
            messageHandler = handler;
          },
        };
      }),
    );

    const ctx: PluginContext<CopyPastePluginOptions> = {
      options: { enabled: true, channelId: 'cp-test' },
      onEditorEvent: vi.fn(),
      onDestroy: vi.fn(),
    };

    const descriptor = CopyPastePlugin as unknown as {
      _setup: (ctx: PluginContext<CopyPastePluginOptions>) => void;
    };
    descriptor._setup(ctx);

    messageHandler?.({ data: { type: 'requestPaste' } } as MessageEvent);
    await new Promise((r) => setTimeout(r, 0));

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pasteData', html: '<b>Hello</b>' }),
    );

    vi.unstubAllGlobals();
  });
});
