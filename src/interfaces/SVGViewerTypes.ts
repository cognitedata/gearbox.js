export interface Conditions {
  condition: (metadataNode: Element) => boolean;
  className: string;
}

export interface ZoomCenter {
  x: number;
  y: number;
}

export interface PinchZoomInterface {
  zoomFactor: number;
  offset: ZoomCenter;
  container: HTMLElement;
  options: {
    animationDuration: number;
  };
  animate: (
    duration: number,
    framefn: (progress: number) => void,
    timefn: (progress: number) => void
  ) => void;
  swing: (p: number) => number;
  update: () => void;
  scaleTo: (zoomFactor: number, center: ZoomCenter) => void;
  stopAnimation: () => void;
  sanitizeOffset: (offset: ZoomCenter) => ZoomCenter;
}
