import { Controller } from './controller.js';

describe('Controller', () => {
  it('should throw when element is not found', () => {
    expect(
      () =>
        new Controller({
          element: '#nonexistent',
          config: {
            document: { fileType: 'docx', key: '1', title: 'test', url: '' },
          },
          documentServerUrl: 'http://localhost',
        }),
    ).toThrow('not found');
  });
});
