import type { OnlyOfficeConfig } from './types.js';

describe('types', () => {
  it('should define OnlyOfficeConfig type', () => {
    const config: OnlyOfficeConfig = {
      document: { fileType: 'docx', key: '1', title: 'test', url: '' },
    };
    expect(config.document.fileType).toBe('docx');
  });
});
