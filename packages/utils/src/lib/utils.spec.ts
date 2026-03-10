import { definePlugin } from './define-plugin.js';
import { uid } from './uid.js';

describe('definePlugin', () => {
  it('should create a plugin descriptor', () => {
    const plugin = definePlugin({ name: 'test' });
    expect(plugin.name).toBe('test');
  });

  it('should support configure', () => {
    const plugin = definePlugin<{ foo: string }>({
      name: 'test',
      defaultOptions: { foo: 'bar' },
    });
    const configured = plugin.configure({ foo: 'baz' });
    expect(configured.options.foo).toBe('baz');
  });
});

describe('uid', () => {
  it('should return a unique string', () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
  });
});
