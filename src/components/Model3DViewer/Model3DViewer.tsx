import { Cognite3DModel, Cognite3DViewer, THREE } from '@cognite/3d-viewer';
import * as sdk from '@cognite/sdk';
import { Button } from 'antd';
import React, { RefObject } from 'react';
import { CacheObject, Callback, MouseScreenPosition } from '../../interfaces';
import {
  createViewer as originalCreateViewer,
  setCameraPosition,
  ViewerEventTypes,
} from '../../utils/threeD';

let createViewer = originalCreateViewer;

type ClickHandler = (position: MouseScreenPosition) => void;

export interface SlicingProps {
  x?: { coord: number; direction: boolean };
  y?: { coord: number; direction: boolean };
  z?: { coord: number; direction: boolean };
}

export interface Model3DViewerProps {
  modelId: number;
  revisionId: number;
  assetId?: number;
  boundingBox?: THREE.Box3;
  cache?: CacheObject;
  enableKeyboardNavigation?: boolean;
  onError?: Callback;
  onProgress?: Callback;
  onComplete?: Callback;
  onReady?: Callback;
  onClick?: Callback;
  onCameraChange?: Callback;
  useDefaultCameraPosition?: boolean;
  slice?: SlicingProps;
  showScreenshotButton?: boolean;
  onScreenshot?: (url: string) => void;
}

export function mockCreateViewer(mockFunction: any) {
  createViewer = mockFunction || originalCreateViewer;
}

export class Model3DViewer extends React.Component<Model3DViewerProps> {
  static defaultProps = {
    enableKeyboardNavigation: true,
    useDefaultCameraPosition: true,
    showScreenshotButton: false,
  };

  disposeCalls: any[] = [];
  divWrapper: RefObject<HTMLDivElement> = React.createRef();
  inputWrapper: RefObject<HTMLInputElement> = React.createRef();
  model: Cognite3DModel | null = null;
  onClickHandlerBounded: ClickHandler;
  onCompleteBounded: Callback;
  revision: sdk.Revision | null = null;
  viewer: Cognite3DViewer | null = null;
  nodes: sdk.AssetMapping[] = [];

  constructor(props: Model3DViewerProps) {
    super(props);

    this.onClickHandlerBounded = this.onClickHandler.bind(this);
    this.onCompleteBounded = this.onComplete.bind(this);
  }

  async componentDidMount() {
    if (!this.divWrapper.current || !this.inputWrapper.current) {
      return;
    }

    const {
      modelId,
      revisionId,
      cache,
      boundingBox,
      enableKeyboardNavigation,
      useDefaultCameraPosition,
      onProgress,
      onReady,
      onCameraChange,
      onError,
      slice,
    } = this.props;
    const { progress, complete } = ViewerEventTypes;
    const {
      viewer,
      addEvent,
      removeEvent,
      revisionPromise,
      modelPromise,
      fromCache,
      domElement,
    } = createViewer({
      modelId,
      revisionId,
      boundingBox,
      cache,
      domElement: this.divWrapper.current,
    });

    this.viewer = viewer;
    // Looks like replaceChild looses onClick event handler, so adding it this way instead
    domElement.addEventListener('click', this.onContainerClick);

    if (!enableKeyboardNavigation) {
      this.viewer.disableKeyboardNavigation();
    }

    if (onProgress) {
      addEvent([[progress, onProgress]]);
    }

    addEvent([[complete, this.onCompleteBounded]]);

    this.addDisposeCall(() => {
      domElement.removeEventListener('click', this.onContainerClick);
      removeEvent();
    });

    let model: Cognite3DModel;
    let revision: sdk.Revision;
    let nodes: sdk.AssetMapping[];

    try {
      [model, revision, nodes] = await Promise.all([
        modelPromise,
        revisionPromise,
        this.findMappedNodes(),
      ]);
    } catch (e) {
      if (onError) {
        onError(e);
      }

      this.dispose();

      return;
    }

    this.model = model;
    this.revision = revision;
    this.nodes = nodes;

    if (useDefaultCameraPosition && !fromCache) {
      this.resetCameraPosition();
    }

    if (onReady) {
      onReady(viewer, model, revision);
    }

    viewer.on('click', this.onClickHandlerBounded);

    if (onCameraChange) {
      viewer.on('cameraChange', onCameraChange);
    }

    if (slice) {
      this.slice(slice);
    }

    this.addDisposeCall(() => {
      viewer.off('click', this.onClickHandlerBounded);

      if (onCameraChange) {
        viewer.off('cameraChange', onCameraChange);
      }
    });
  }

  async componentDidUpdate(prevProps: Model3DViewerProps) {
    const { onError, assetId } = this.props;
    const { assetId: pAssetId } = prevProps;

    if (assetId === pAssetId) {
      return;
    }

    try {
      this.nodes = await this.findMappedNodes();
      this.highlightNodes();
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
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

    if (!viewer || !model || !revision) {
      return;
    }

    setCameraPosition(viewer, model, revision, boundingBox);
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
      onClick(intersection.nodeId, intersection.point);
    }
  }

  onContainerClick = () => {
    if (this.inputWrapper.current) {
      this.inputWrapper.current.focus();
    }
  };

  onBlur = () => {
    if (this.viewer) {
      this.viewer.disableKeyboardNavigation();
    }
  };

  onFocus = () => {
    if (this.viewer && this.props.enableKeyboardNavigation) {
      this.viewer.enableKeyboardNavigation();
    }
  };

  slice = (sliceProps: SlicingProps) => {
    if (this.viewer) {
      const planes = [];
      if (sliceProps.x) {
        const plane = new THREE.Plane(
          new THREE.Vector3(sliceProps.x.direction ? 1 : -1, 0, 0),
          sliceProps.x.coord
        );
        planes.push(plane);
      }
      if (sliceProps.y) {
        const plane = new THREE.Plane(
          new THREE.Vector3(0, sliceProps.y.direction ? 1 : -1, 0),
          sliceProps.y.coord
        );
        planes.push(plane);
      }
      if (sliceProps.z) {
        const plane = new THREE.Plane(
          new THREE.Vector3(0, 0, sliceProps.z.direction ? 1 : -1),
          sliceProps.z.coord
        );
        planes.push(plane);
      }
      this.viewer.setSlicingPlanes(planes);
    }
  };

  takeScreenShot = async () => {
    if (this.viewer) {
      const url = await this.viewer.getScreenshot();
      if (this.props.onScreenshot) {
        this.props.onScreenshot(url);
      }
    }
  };

  render() {
    return (
      // Need this div since caching uses replaceChild on divWrapper ref, so need a surrounding div
      <div style={{ width: '100%', height: '100%' }}>
        {this.props.showScreenshotButton ? (
          <Button onClick={this.takeScreenShot}>Take ScreenShot</Button>
        ) : (
          <></>
        )}
        <input
          type="text"
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          ref={this.inputWrapper}
          style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
        />
        <div
          style={{ width: '100%', height: '100%', fontSize: 0 }}
          ref={this.divWrapper}
        />
      </div>
    );
  }
  private async findMappedNodes(): Promise<sdk.AssetMapping[]> {
    const { assetId, modelId, revisionId } = this.props;

    if (!assetId) {
      return Promise.resolve([]);
    }

    const { items } = await sdk.ThreeD.listAssetMappings(modelId, revisionId, {
      assetId,
    });

    return items;
  }

  private highlightNodes() {
    const { length } = this.nodes;

    if (!this.model || !this.viewer) {
      return;
    }

    this.model.deselectAllNodes();

    if (length === 1) {
      const { nodeId } = this.nodes[0];

      this.model.updateMatrixWorld();

      const reusableBox = new THREE.Box3();
      const bb = this.model.getBoundingBox(nodeId, reusableBox);

      this.model.selectNode(nodeId);

      if (!bb.isEmpty()) {
        this.viewer.fitCameraToBoundingBox(bb);
      }
    } else {
      this.nodes.forEach((node: sdk.AssetMapping) =>
        // @ts-ignore
        this.model.selectNode(node.nodeId)
      );
    }
  }

  private onComplete() {
    const { onComplete, assetId } = this.props;

    if (assetId) {
      this.highlightNodes();
    }

    if (onComplete) {
      onComplete();
    }
  }
}
