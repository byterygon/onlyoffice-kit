import { Controller } from './vue.js';

describe('vue', () => {
  it('should re-export Controller from core', () => {
    expect(Controller).toBeDefined();
  });
});
