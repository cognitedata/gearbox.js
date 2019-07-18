import { Asset } from '@cognite/sdk/dist/src/types/types';

export function clampNumber(v: number, minValue: number, maxValue: number) {
  return Math.max(Math.min(v, maxValue), minValue);
}

export function sortStringsAlphabetically(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function getCanvas(
  img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  width: number,
  height: number
) {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  return canvas;
}

export function extractValidStrings(
  textAnnotations: Asset[] = [],
  maxLen: number = 20,
  minLen: number = 5
) {
  const validStrings = textAnnotations
    .map((annotation: Asset) =>
      annotation.description ? annotation.description.trim() : ''
    )
    .filter(word => word.length > minLen && word.length < maxLen);

  return [...new Set(validStrings)];
}
