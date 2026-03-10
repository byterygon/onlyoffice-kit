import { Controller } from './angular.js';

describe('angular', () => {
  it('should re-export Controller from core', () => {
    expect(Controller).toBeDefined();
  });
});
