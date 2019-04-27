import 'regenerator-runtime';

import { Cognite3DModel, Cognite3DViewer, THREE } from '@cognite/3d-viewer';
import * as sdk from '@cognite/sdk';
import React from 'react';
import { CacheObject, Callback, MouseScreenPosition } from '../../interfaces';
import {
  createViewer as originalCreateViewer,
  parseBoundingBox,
  setCameraPosition,
  ViewerEventTypes,
} from '../../utils';

let createViewer = originalCreateViewer;

type ClickHandler = (position: MouseScreenPosition) => void;

export interface Model3DViewerProps {
  boundingBox: THREE.Box3;
  cache: CacheObject;
  defaultCameraPosition?: boolean;
  modelId: number;
  onError?: Callback;
  onProgress?: Callback;
  onComplete?: Callback;
  onReady?: Callback;
  onClick?: Callback;
  onCameraChange?: Callback;
  projectName: string;
  revisionId: number;
}

export function mockCreateViewer(mockFunction: any) {
  createViewer = mockFunction || originalCreateViewer;
}

export class Model3DViewer extends React.Component<Model3DViewerProps> {
  static defaultProps = {
    boundingBox: parseBoundingBox({
      min: [Infinity, Infinity, Infinity],
      max: [-Infinity, -Infinity, -Infinity],
    }),
    defaultCameraPosition: true,
    cache: {},
  };

  disposeCalls: any[] = [];
  divWrapper: HTMLElement | null = null;
  model: Cognite3DModel | null = null;
  onClickHandlerBounded: ClickHandler;
  revision: sdk.Revision | null = null;
  viewer: Cognite3DViewer | null = null;

  constructor(props: Model3DViewerProps) {
    super(props);

    this.onClickHandlerBounded = this.onClickHandler.bind(this);
  }

  async componentDidMount() {
    const {
      projectName,
      modelId,
      revisionId,
      cache,
      boundingBox,
      defaultCameraPosition,
      onProgress,
      onComplete,
      onReady,
      onCameraChange,
      onError,
    } = this.props;
    const { progress, complete } = ViewerEventTypes;
    const threeJsBoundingBox = parseBoundingBox(boundingBox);
    const {
      viewer,
      addEvent,
      removeEvent,
      revisionPromise,
      modelPromise,
    } = createViewer({
      projectName,
      modelId,
      revisionId,
      boundingBox: threeJsBoundingBox,
      cache,
    });

    this.viewer = viewer;

    if (onProgress) {
      addEvent([[progress, onProgress]]);
    }

    if (onComplete) {
      addEvent([[complete, onComplete]]);
    }

    this.addDisposeCall(() => {
      removeEvent();
    });

    if (this.divWrapper) {
      this.divWrapper.appendChild(viewer.getCanvas());
    }

    let model: Cognite3DModel;
    let revision: sdk.Revision;

    try {
      [model, revision] = await Promise.all([modelPromise, revisionPromise]);
    } catch (e) {
      if (onError) {
        onError(e);
      }

      this.dispose();

      return;
    }

    this.model = model;
    this.revision = revision;

    if (defaultCameraPosition) {
      this.resetCameraPosition();
    }

    if (onReady) {
      onReady(viewer, model, revision);
    }

    viewer.on('click', this.onClickHandlerBounded);

    if (onCameraChange) {
      viewer.on('cameraChange', onCameraChange);
    }

    this.addDisposeCall(() => {
      viewer.off('click', this.onClickHandlerBounded);

      if (onCameraChange) {
        viewer.off('cameraChange', onCameraChange);
      }
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  addDisposeCall = (func: any) => {
    this.disposeCalls.push(func);
  };

  dispose = () => {
    this.disposeCalls.forEach(func => {
      func();
    });
  };

  resetCameraPosition = () => {
    const {
      viewer,
      model,
      revision,
      props: { boundingBox },
    } = this;
    const parsedBoundingBox = parseBoundingBox(boundingBox);

    if (!viewer || !model || !revision) {
      return;
    }

    setCameraPosition(viewer, model, parsedBoundingBox, revision);
  };

  onClickHandler({ offsetX, offsetY }: MouseScreenPosition) {
    const { onClick } = this.props;

    if (!this.viewer || !onClick) {
      return;
    }

    const intersection = this.viewer.getIntersectionFromPixel(offsetX, offsetY);
    if (intersection === null) {
      onClick(null);
    } else {
      onClick(intersection.nodeId);
    }
  }

  render() {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
        ref={ref => (this.divWrapper = ref)}
      />
    );
  }
}
