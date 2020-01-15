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
   * Subscribe to SVGVieweSearch changes
   */
  handleSearchChange?: () => void;
}

export type SvgViewerProps = SvgViewerDocumentIdProps | SvgViewerFileProps;

export interface SvgViewerDocumentIdProps extends SvgViewerBasicProps {
  /**
   * CDF fileId to fetch svg-document
   */
  documentId: number;
}
export interface SvgViewerFileProps extends SvgViewerBasicProps {
  /**
   * svg-document file content in string format
   */
  file: string;
}
