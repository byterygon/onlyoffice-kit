import { BridgePlugin } from './bridge.js';

describe('BridgePlugin', () => {
  it('should have correct name', () => {
    expect(BridgePlugin.name).toBe('bridge');
  });

  it('should support configure', () => {
    const configured = BridgePlugin.configure({ channelId: 'test-123' });
    expect(configured.options.channelId).toBe('test-123');
  });
});
