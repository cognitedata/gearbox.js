import { Asset } from '@cognite/sdk';

export function clampNumber(v: number, minValue: number, maxValue: number) {
  return Math.max(Math.min(v, maxValue), minValue);
}

export function sortStringsAlphabetically(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function getMiddlePixelsOfContainer(
  width: number,
  height: number,
  parentWidth: number,
  parentHeight: number
) {
  return {
    sx: Math.ceil((parentWidth - width) / 2),
    sy: Math.ceil((parentHeight - height) / 2),
    sw: width,
    sh: height,
    dx: Math.ceil((parentWidth - width) / 2),
    dy: Math.ceil((parentHeight - height) / 2),
    dw: width,
    dh: height,
  };
}

export interface CropSize {
  width: number;
  height: number;
}
export function getCanvas(
  img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  width: number,
  height: number,
  cropSize?: CropSize
) {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  const cropProps = cropSize
    ? {
        sx: Math.ceil((canvas.width - cropSize.width) / 2),
        sy: Math.ceil((canvas.height - cropSize.height) / 2),
        sw: cropSize.width,
        sh: cropSize.height,
        dx: Math.ceil((canvas.width - cropSize.width) / 2),
        dy: Math.ceil((canvas.height - cropSize.height) / 2),
        dw: cropSize.width,
        dh: cropSize.height,
      }
    : {
        sx: 0,
        sy: 0,
        sw: canvas.width,
        sh: canvas.height,
        dx: 0,
        dy: 0,
        dw: canvas.width,
        dh: canvas.height,
      };

  if (ctx) {
    console.log('Cropping', 'W:', width, ' H:', height);
    console.log(cropProps);
    ctx.drawImage(
      img,
      cropProps.sx,
      cropProps.sy,
      cropProps.sw,
      cropProps.sh,
      cropProps.dx,
      cropProps.dy,
      cropProps.dw,
      cropProps.dh
    );
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

export function removeImageBase(imageString: string = ''): string {
  const [base, src] = imageString.split(',');

  return src || base;
}
