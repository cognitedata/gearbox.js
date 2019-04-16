export function clampNumber(v: number, minValue: number, maxValue: number) {
  return Math.max(Math.min(v, maxValue), minValue);
}
