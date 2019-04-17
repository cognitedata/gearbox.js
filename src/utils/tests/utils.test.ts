import { clampNumber } from '../';

describe('clampNumber helper', () => {
  it('should return max if the value is greater than max', () => {
    expect(clampNumber(10, 0, 5)).toBe(5);
  });

  it('should return min if the value is less than min', () => {
    expect(clampNumber(-5, 0, 5)).toBe(0);
  });

  it('should return same value if the it is in min/max range', () => {
    expect(clampNumber(2, 0, 5)).toBe(2);
  });
});
