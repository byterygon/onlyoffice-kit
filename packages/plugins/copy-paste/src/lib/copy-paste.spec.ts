import { CopyPastePlugin } from './copy-paste.js';

describe('CopyPastePlugin', () => {
  it('should have correct name', () => {
    expect(CopyPastePlugin.name).toBe('copy-paste');
  });

  it('should default to enabled', () => {
    expect(CopyPastePlugin.options.enabled).toBe(true);
  });
});
