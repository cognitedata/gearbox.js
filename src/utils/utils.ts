import { VAsset } from './validators';

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
  textAnnotations: VAsset[] = [],
  maxLen: number = 20,
  minLen: number = 5
) {
  const validStrings = textAnnotations
    .map((annotation: VAsset) =>
      annotation.description ? annotation.description.trim() : ''
    )
    .filter(word => word.length > minLen && word.length < maxLen);

  return [...new Set(validStrings)];
}
