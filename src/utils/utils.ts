import { Asset } from '@cognite/sdk';
import ms from 'ms';
import { CropSize } from '..';

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
    sx: Math.floor((parentWidth - width) / 2),
    sy: Math.ceil((parentHeight - height) / 2),
    sw: width,
    sh: height,
    dx: Math.ceil((parentWidth - width) / 2),
    dy: Math.ceil((parentHeight - height) / 2),
    dw: width,
    dh: height,
  };
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

  const fullContainer = {
    sx: 0,
    sy: 0,
    sw: canvas.width,
    sh: canvas.height,
    dx: 0,
    dy: 0,
    dw: canvas.width,
    dh: canvas.height,
  };

  const cropProps = cropSize
    ? getMiddlePixelsOfContainer(cropSize.width, cropSize.height, width, height)
    : fullContainer;

  if (ctx) {
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

export const shouldScaleYAxis = (
  videoHeight: number,
  videoWidth: number,
  clientHeight: number,
  clientWidth: number
): boolean => {
  const clientRatio = clientWidth / clientHeight;
  const videoRatio = videoWidth / videoHeight;
  return clientRatio < videoRatio;
};

export const scaleDomToVideoResolution = (
  videoHeight: number,
  videoWidth: number,
  sourceClientHeight: number,
  sourceClientWidth: number
): { clientHeight: number; clientWidth: number } => {
  const isScalingYAxis = shouldScaleYAxis(
    videoHeight,
    videoWidth,
    sourceClientHeight,
    sourceClientWidth
  );
  const scaledClient = {
    clientHeight: sourceClientHeight,
    clientWidth: sourceClientWidth,
  };
  if (isScalingYAxis) {
    scaledClient.clientHeight = Math.round(
      (sourceClientWidth * videoHeight) / videoWidth
    );
  } else {
    scaledClient.clientWidth = Math.round(
      (videoWidth * sourceClientHeight) / videoHeight
    );
  }
  return scaledClient;
};

/**
 * Because the canvas uses the video resolution, we need to scale the clientPx to fit the videoPx
 * That way the users perception of the cropped area is the same as the actual cropping.
 */
export const scaleCropSizeToVideoResolution = (
  videoHeight: number,
  videoWidth: number,
  clientHeight: number,
  clientWidth: number,
  initialCropSize?: CropSize
): CropSize | undefined => {
  return initialCropSize
    ? {
        height: initialCropSize.height * (videoHeight / clientHeight),
        width: initialCropSize.width * (videoWidth / clientWidth),
      }
    : undefined;
};

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

export function getGranularityInMS(granularity: string): number {
  return ms(granularity);
}
