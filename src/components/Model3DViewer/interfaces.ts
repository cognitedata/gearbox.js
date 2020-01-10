import { THREE } from '@cognite/3d-viewer';
import React from 'react';
import { CacheObject, Callback } from '../../interfaces';

export interface SliderRange {
  max: number;
  min: number;
}

export interface SlicingDetail {
  coord: number;
  direction: boolean;
}

export interface SlicingProps {
  x?: SlicingDetail;
  y?: SlicingDetail;
  z?: SlicingDetail;
}

export interface SliderProps {
  x?: SliderRange;
  y?: SliderRange;
  z?: SliderRange;
}

export interface Model3DViewerStyles {
  wrapper: React.CSSProperties;
  viewer: React.CSSProperties;
}

export interface Model3DViewerProps {
  /**
   * model ID number
   */
  modelId: number;
  /**
   * model revision ID number
   */
  revisionId: number;
  /**
   * this is used to control highlighting of asset node in the model right after init process
   * or by changing `assetId` prop after viewer has been initialized
   */
  assetId?: number;
  /**
   * bounding box object, that describes dimension of viewed asset nodes
   */
  boundingBox?: THREE.Box3;
  /**
   * object for caching 3D viewers instances
   */
  cache?: CacheObject;
  /**
   * enable keyboard navigation in viewer. Viewer must be in focus
   */
  enableKeyboardNavigation?: boolean;
  /**
   * enable default highlighting of 3D nodes that are associated with some asset
   */
  highlightMappedNodes?: boolean;
  /**
   * on error occurs callback
   */
  onError?: Callback;
  /**
   * on model loading progress callback
   */
  onProgress?: Callback;
  /**
   * on model complete loading callback (in this callback you can
   * start to call viewer and model methods)
   */
  onComplete?: Callback;
  /**
   * on scene prepared to display model callback
   * (return internal instances of viewer and model)
   */
  onReady?: Callback;
  /**
   * on model click handler
   */
  onClick?: Callback;
  /**
   * on scene camera change position callback
   */
  onCameraChange?: Callback;
  /**
   * use default camera position
   */
  useDefaultCameraPosition?: boolean;
  /**
   * set the slicing property of viewer
   */
  slice?: SlicingProps;
  /**
   * enable visual sliders for the viewer
   */
  slider?: SliderProps;
  /**
   * enable screenshot button in viewer
   */
  showScreenshotButton?: boolean;
  /**
   * callback after screenshot is taken
   */
  onScreenshot?: (url: string) => void;
  /**
   * allow wrapper and viewer styling
   */
  styles?: Model3DViewerStyles;
}
