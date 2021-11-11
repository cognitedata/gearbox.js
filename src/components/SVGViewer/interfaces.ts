// Copyright 2020 Cognite AS
export interface Conditions {
  condition: (metadataNode: Element) => boolean;
  className: string;
}
export interface ZoomCenter {
  x: number;
  y: number;
}

export interface CustomClassNames {
  searchResults?: string;
  currentSearchResult?: string;
  currentAsset?: string;
}

export interface PinchZoomInterface {
  zoomFactor: number;
  offset: ZoomCenter;
  container: HTMLElement;
  options: {
    animationDuration: number;
    maxZoom?: number;
    minZoom?: number;
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

interface SvgViewerBasicProps {
  /**
   * List of classes and conditions on when they should be applied for equipment
   */
  metadataClassesConditions?: Conditions[];
  /**
   * Document title
   */
  title?: string;
  /**
   * Document description
   */
  description?: string;
  /**
   * Display text with stroke-width: 0
   */
  showOverlappedText?: boolean;
  /**
   * Override default colors with custom classNames
   */
  customClassNames?: CustomClassNames;
  /**
   * Maximum zoom for the svg viewer
   */
  maxZoom?: number;
  /**
   * Minimum zoom for the svg viewer
   */
  minZoom?: number;
  /**
   * Initial zoom when the svg viewer is first opened
   */
  initialZoom?: number;
  /**
   * Condition to locate and highlight current asset during first render
   */
  isCurrentAsset?: (metadataNode: Element) => boolean;
  /**
   * Viewer close callback
   */
  handleCancel?: () => void;
  /**
   * Zoom callback
   */
  handleAnimateZoom?: ({
    zoomProgress,
    source,
    zoomCenter,
  }: {
    zoomProgress: number;
    source: string;
    zoomCenter?: ZoomCenter;
  }) => void;
  /**
   * Item click callback
   */
  handleItemClick?: (metadataNode: HTMLElement) => void;
  /**
   * Error document load callback
   */
  handleDocumentLoadError?: (error: Error) => void;
  /**
   * Subscribe to SVGViewerSearch changes
   */
  handleSearchChange?: (value?: string) => void;
  /**
   * A downloadable PDF version of the current file
   * File content must be in string format
   * If one is provided, a download button will appear
   * on the top right hand side of the viewer
   */
  downloadablePdf?: string;
}

export interface SvgViewerDocumentIdProps {
  /**
   * CDF fileId to fetch svg-document
   */
  documentId: number;
}

export interface SvgViewerFileProps {
  /**
   * svg-document file content in string format
   */
  file: string;
}

export type SvgViewerProps =
  | (SvgViewerDocumentIdProps & SvgViewerBasicProps)
  | (SvgViewerFileProps & SvgViewerBasicProps);
