import type {
  EditorEventName,
  PluginContext,
} from '@byterygon/onlyoffice-kit-types';
import { BRIDGE_PLUGIN_GUID, BridgePlugin } from './bridge.js';

describe('BridgePlugin', () => {
  it('should have correct name', () => {
    expect(BridgePlugin.name).toBe('bridge');
  });

  it('should support configure', () => {
    const configured = BridgePlugin.configure({ channelId: 'test-123' });
    expect(configured.options.channelId).toBe('test-123');
  });

  it('should default to the stable well-known channelId', () => {
    expect(BridgePlugin.options.channelId).toBe('onlyoffice-kit-bridge');
  });

  it('should export the companion plugin GUID', () => {
    expect(BRIDGE_PLUGIN_GUID).toBe(
      'asc.{3a6f4b2c-1d5e-4a9b-8c7f-2e0d1b3a5c9e}',
    );
  });

  it('should have a setup function', () => {
    const descriptor = BridgePlugin as unknown as {
      _setup?: (ctx: PluginContext<unknown>) => void;
    };
    expect(typeof descriptor._setup).toBe('function');
  });

  it('should open and close a BroadcastChannel on setup/destroy', () => {
    const closeSpy = vi.fn();
    const postMessageSpy = vi.fn();
    const MockBroadcastChannel = vi.fn(function MockBC() {
      return {
        close: closeSpy,
        postMessage: postMessageSpy,
        addEventListener: vi.fn(),
      };
    });
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);

    const destroyCallbacks: Array<() => void> = [];
    const ctx: PluginContext<{ channelId: string }> = {
      options: { channelId: 'test-channel' },
      onEditorEvent: vi.fn(),
      onDestroy: (cb) => destroyCallbacks.push(cb),
    };

    const descriptor = BridgePlugin as unknown as {
      _setup: (ctx: PluginContext<{ channelId: string }>) => void;
    };
    descriptor._setup(ctx);

    expect(BroadcastChannel).toHaveBeenCalledWith('test-channel');

    for (const cb of destroyCallbacks) cb();
    expect(closeSpy).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('should forward editor events to the channel', () => {
    const postMessageSpy = vi.fn();
    vi.stubGlobal(
      'BroadcastChannel',
      vi.fn(function MockBC() {
        return {
          close: vi.fn(),
          postMessage: postMessageSpy,
          addEventListener: vi.fn(),
        };
      }),
    );

    let capturedEventHandler:
      | ((name: EditorEventName, payload?: unknown) => void)
      | undefined;
    const ctx: PluginContext<{ channelId: string }> = {
      options: { channelId: 'test-channel' },
      onEditorEvent: (handler) => {
        capturedEventHandler = handler;
      },
      onDestroy: vi.fn(),
    };

    const descriptor = BridgePlugin as unknown as {
      _setup: (ctx: PluginContext<{ channelId: string }>) => void;
    };
    descriptor._setup(ctx);

    capturedEventHandler?.('onAppReady', undefined);
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: 'editorEvent',
      name: 'onAppReady',
      payload: undefined,
    });

    vi.unstubAllGlobals();
  });
});
