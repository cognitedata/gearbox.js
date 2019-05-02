import { Cognite3DModel, Cognite3DViewer, THREE } from '@cognite/3d-viewer';
import * as sdk from '@cognite/sdk';
import React from 'react';
import { CacheObject, Callback, MouseScreenPosition } from '../../interfaces';
import {
  createViewer as originalCreateViewer,
  setCameraPosition,
  ViewerEventTypes,
} from '../../utils';

let createViewer = originalCreateViewer;

type ClickHandler = (position: MouseScreenPosition) => void;

export interface Model3DViewerProps {
  modelId: number;
  revisionId: number;
  cache: CacheObject;
  boundingBox?: THREE.Box3;
  assetId?: number;
  onError?: Callback;
  onProgress?: Callback;
  onComplete?: Callback;
  onReady?: Callback;
  onClick?: Callback;
  onCameraChange?: Callback;
  useDefaultCameraPosition?: boolean;
}

export function mockCreateViewer(mockFunction: any) {
  createViewer = mockFunction || originalCreateViewer;
}

export class Model3DViewer extends React.Component<Model3DViewerProps> {
  static defaultProps = {
    useDefaultCameraPosition: true,
    cache: {},
  };

  disposeCalls: any[] = [];
  divWrapper: HTMLElement | null = null;
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
    const {
      modelId,
      revisionId,
      cache,
      boundingBox,
      useDefaultCameraPosition,
      onProgress,
      onReady,
      onCameraChange,
      onError,
    } = this.props;
    const { progress, complete } = ViewerEventTypes;
    const {
      viewer,
      addEvent,
      removeEvent,
      revisionPromise,
      modelPromise,
    } = createViewer({
      modelId,
      revisionId,
      boundingBox,
      cache,
    });

    this.viewer = viewer;

    if (onProgress) {
      addEvent([[progress, onProgress]]);
    }

    addEvent([[complete, this.onCompleteBounded]]);

    this.addDisposeCall(() => {
      removeEvent();
    });

    if (this.divWrapper) {
      this.divWrapper.appendChild(viewer.getCanvas());
    }

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

    if (useDefaultCameraPosition) {
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

  async componentDidUpdate() {
    const { onError } = this.props;
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

    if (!length) {
      this.viewer.fitCameraToModel(this.model);
    } else if (length === 1) {
      const { nodeId } = this.nodes[0];
      const bb = this.model.getBoundingBox(nodeId);

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
    const { onComplete } = this.props;

    this.highlightNodes();

    if (onComplete) {
      onComplete();
    }
  }
}
