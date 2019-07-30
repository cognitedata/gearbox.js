import { Cognite3DModel, Cognite3DViewer, THREE } from '@cognite/3d-viewer';
import * as sdk from '@cognite/sdk';
import { Button, Slider } from 'antd';
import { SliderValue } from 'antd/lib/slider';
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

export interface SliderProps {
  x?: { max: number; min: number };
  y?: { max: number; min: number };
  z?: { max: number; min: number };
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
  slider?: SliderProps;
  showScreenshotButton?: boolean;
  onScreenshot?: (url: string) => void;
}

interface Model3DViewerState {
  planes: THREE.Plane[];
  flipped: [boolean, boolean, boolean];
}

export function mockCreateViewer(mockFunction: any) {
  createViewer = mockFunction || originalCreateViewer;
}

export class Model3DViewer extends React.Component<
  Model3DViewerProps,
  Model3DViewerState
> {
  [x: string]: any;
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

    this.state = {
      planes: [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), Infinity),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), Infinity),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), Infinity),
      ],
      flipped: [true, true, true],
    };
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
      const planes = this.state.planes;
      if (sliceProps.x) {
        const plane = new THREE.Plane(
          new THREE.Vector3(sliceProps.x.direction ? 1 : -1, 0, 0),
          sliceProps.x.coord
        );
        planes[0] = plane;
      }
      if (sliceProps.y) {
        const plane = new THREE.Plane(
          new THREE.Vector3(0, sliceProps.y.direction ? 1 : -1, 0),
          sliceProps.y.coord
        );
        planes[1] = plane;
      }
      if (sliceProps.z) {
        const plane = new THREE.Plane(
          new THREE.Vector3(0, 0, sliceProps.z.direction ? 1 : -1),
          sliceProps.z.coord
        );
        planes[2] = plane;
      }
      this.setState({ planes });
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

  onchange = (val: number, axis: string) => {
    const planes = this.state.planes;
    const flipped = this.state.flipped;
    switch (axis) {
      case 'x': {
        planes[0].set(planes[0].normal, flipped[0] ? val : -val);
        break;
      }
      case 'y': {
        planes[1].set(planes[1].normal, flipped[1] ? val : -val);
        break;
      }
      case 'z': {
        planes[2].set(planes[2].normal, flipped[2] ? val : -val);
        break;
      }
      default: {
        break;
      }
    }
    this.setState({ planes });
  };

  flipSlider = (axis: string) => {
    const planes = this.state.planes;
    const flipped = this.state.flipped;
    switch (axis) {
      case 'x': {
        planes[0].negate();
        flipped[0] = !flipped[0];
        break;
      }
      case 'y': {
        planes[1].negate();
        flipped[1] = !flipped[1];
        break;
      }
      case 'z': {
        planes[2].negate();
        flipped[2] = !flipped[2];
        break;
      }
      default: {
        break;
      }
    }
    this.setState({ planes });
    this.setState({ flipped });
  };

  renderSliders = () => {
    if (!this.props.slider) {
      return <></>;
    }
    let xSlider = <></>;
    let ySlider = <></>;
    let zSlider = <></>;
    if (this.props.slider.x) {
      const x = this.props.slider.x;
      xSlider = (
        <div style={{ paddingTop: '2vh' }}>
          <span style={{ float: 'left', marginTop: '0.5vh' }}>
            <h4>x</h4>
          </span>
          <Slider
            step={(x.max - x.min) / 100}
            min={x.min}
            max={x.max}
            defaultValue={x.max}
            style={{ width: '80%', float: 'left', paddingTop: '0' }}
            onChange={(val: SliderValue) => this.onchange(val as number, 'x')}
          />
          <Button
            type="primary"
            icon="redo"
            size="small"
            style={{ marginLeft: '2%' }}
            onClick={() => this.flipSlider('x')}
          />
        </div>
      );
    }
    if (this.props.slider.y) {
      const y = this.props.slider.y;
      ySlider = (
        <div style={{ paddingTop: '2vh' }}>
          <span style={{ float: 'left', marginTop: '0.5vh' }}>
            <h4>y</h4>
          </span>
          <Slider
            step={(y.max - y.min) / 100}
            min={y.min}
            max={y.max}
            defaultValue={y.max}
            style={{
              width: '80%',
              float: 'left',
              paddingTop: '0',
            }}
            onChange={(val: SliderValue) => this.onchange(val as number, 'y')}
          />
          <Button
            type="primary"
            icon="redo"
            size="small"
            style={{ marginLeft: '2%' }}
            onClick={() => this.flipSlider('y')}
          />
        </div>
      );
    }
    if (this.props.slider.z) {
      const z = this.props.slider.z;
      zSlider = (
        <div style={{ paddingTop: '2vh' }}>
          <span style={{ float: 'left', marginTop: '0.5vh' }}>
            <h4>z</h4>
          </span>
          <Slider
            step={(z.max - z.min) / 100}
            min={z.min}
            max={z.max}
            defaultValue={z.max}
            style={{ width: '80%', float: 'left', paddingTop: '0' }}
            onChange={(val: SliderValue) => this.onchange(val as number, 'z')}
          />
          <Button
            type="primary"
            icon="redo"
            size="small"
            style={{ marginLeft: '2%' }}
            onClick={() => this.flipSlider('z')}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          background: 'white',
          position: 'absolute',
          width: '27vw',
          marginTop: '2vh',
          marginLeft: '66vw',
          padding: '1%',
        }}
      >
        {xSlider}
        {ySlider}
        {zSlider}
      </div>
    );
  };

  render() {
    if (this.viewer) {
      this.viewer.setSlicingPlanes(this.state.planes);
    }
    return (
      // Need this div since caching uses replaceChild on divWrapper ref, so need a surrounding div
      <div style={{ width: '100vw' }}>
        {this.props.showScreenshotButton ? (
          <div
            style={{
              position: 'absolute',
              marginTop: '2vh',
              marginLeft: '2vw',
            }}
          >
            <Button onClick={this.takeScreenShot}>Take ScreenShot</Button>
          </div>
        ) : (
          <></>
        )}
        {this.renderSliders()}
        <div
          style={{
            width: '95vw',
            height: '100%',
          }}
        >
          <input
            type="text"
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            ref={this.inputWrapper}
            style={{
              opacity: 0,
              pointerEvents: 'none',
              position: 'absolute',
            }}
          />
          <div
            style={{ width: '100%', height: '100%', fontSize: 0 }}
            ref={this.divWrapper}
          />
        </div>
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
