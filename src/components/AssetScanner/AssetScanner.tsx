import { Asset, CogniteClient } from '@cognite/sdk';
import React, { Component } from 'react';
import styled from 'styled-components';

import { ocrRecognize } from '../../api';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import {
  Callback,
  CropSize,
  EmptyCallback,
  OcrRequest,
  OnAssetListCallback,
  PureObject,
  SetVideoRefCallback,
} from '../../interfaces';
import {
  notification,
  ocrAssetFind,
  ocrAssetNotFind,
  ocrError,
  ocrErrorVideo,
  ocrNoTextFound,
  ocrSuccess,
} from '../../utils/notifications';
import {
  getCanvas,
  removeImageBase,
  scaleCropSizeToVideoResolution,
  scaleDomToVideoResolution,
} from '../../utils/utils';
import { WebcamScanner } from './WebcamScanner/WebcamScanner';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: row;
`;

export enum ASNotifyTypes {
  recognizeSuccess = 'recognizeSuccess',
  recognizeFails = 'recognizeFails',
  assetsFind = 'assetsFind',
  assetsEmpty = 'assetsEmpty',
  errorVideoAccess = 'errorVideoAccess',
  errorOccurred = 'errorOccurred',
}

type ASNotification = (type: ASNotifyTypes) => any;

export type ButtonRenderProp = (
  onCapture: Callback,
  isReady: boolean
) => React.ReactNode;

export interface AssetScannerStyles {
  button: React.CSSProperties;
}

export interface AssetScannerProps {
  /**
   * Function that provides custom OCR call to detect strings on image
   */
  ocrRequest: (ocrParams: OcrRequest) => Promise<string[]>;
  /**
   * Base64 image representation which uses as a source for recognition
   * (instead of webcamera image)
   */
  image?: string;
  /**
   * ocrKey	API key property which is needed if you use embedded Google Vision API
   */
  ocrKey?: string;
  /**
   * Render prop function, that should returns button node. Capture function and
   * image base64 string are passed as arguments
   */
  button?: ButtonRenderProp;
  /**
   * Function that gets a result from the recognize function and formats it as an
   * array of recognized strings (Can be used if you use embedded Google Vision API)
   */
  extractOcrStrings?: (ocrResult: any) => string[];
  /**
   * enableNotification	Flag that controls enabling/disabling notification feature.
   * If customNotification doesn't set then antd messages will be used by default
   */
  enableNotification?: boolean;
  /**
   * Callback function to react on provided type of notification (will be ignored if enableNotification = false)
   */
  customNotification?: ASNotification;
  /**
   * Callback triggered when image recognition process starts
   */
  onImageRecognizeStart?: (image: string) => void;
  /**
   * Callback triggered when image recognition process is finished and right before fetching assets by recognized strings
   */
  onImageRecognizeFinish?: (strings: string[] | null) => void;
  /**
   * Callback triggered if strings haven't been recognized on provided image
   */
  onImageRecognizeEmpty?: Callback;
  /**
   * Callback triggered when SDK asset search has been finished
   */
  onAssetFetchResult?: OnAssetListCallback;
  /**
   * Callback triggered right after taking a shot from camera
   */
  onStartLoading?: EmptyCallback;
  /**
   * Callback triggered after finishing recognition process
   */
  onEndLoading?: EmptyCallback;
  /**
   * Callback triggered when occurs an error related to OCR service/request
   */
  onOcrError?: Callback;
  /**
   * Callback triggered when an error occurs
   */
  onError?: Callback;
  /**
   * Callback triggered after resetting captured image
   */
  onImageReset?: Callback;
  /**
   * styles	Object that defines inline CSS styles for inner elements of the component
   * (Use if you not provide button render prop)
   */
  styles?: AssetScannerStyles;
  /**
   * Object that defines strings to be passed to component
   */
  imageAltText?: string;
  strings?: PureObject;
  cropSize?: CropSize;
  webcamCropOverlay?: React.ComponentType;
  getAssetsHandlerCustom?: (strings: string[]) => Promise<Asset[]>;
}

interface AssetScannerState {
  isLoading: boolean;
  ready: boolean;
  imageSrc: string;
}

export class AssetScanner extends Component<
  AssetScannerProps,
  AssetScannerState
> {
  static displayName = 'AssetScanner';
  static defaultProps = {
    ocrRequest: ocrRecognize,
    enableNotification: false,
  };

  static contextType = ClientSDKProxyContext;

  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;

  notification: ASNotification = this.prepareNotifications();

  state: AssetScannerState = {
    isLoading: false,
    ready: true,
    imageSrc: '',
  };
  video: HTMLVideoElement | null = null;

  setRefBound: SetVideoRefCallback = this.setRef.bind(this);
  captureBound: EmptyCallback = this.capture.bind(this);
  resetSearchBound: EmptyCallback = this.resetSearch.bind(this);

  constructor(props: AssetScannerProps) {
    super(props);

    const { image } = props;

    if (image) {
      this.state.imageSrc = image;
    }
  }

  setRef(video: HTMLVideoElement | null) {
    this.video = video;
  }

  setReady(isReady: boolean = true): Promise<void> {
    return new Promise(resolve => {
      this.setState({ ready: isReady }, () => resolve());
    });
  }

  resetSearch() {
    const { onImageReset } = this.props;

    if (!this.video) {
      return;
    }

    if (onImageReset) {
      onImageReset();
    }

    this.setState({
      imageSrc: '',
      isLoading: false,
      ready: true,
    });
  }

  componentDidMount() {
    this.client = this.context(AssetScanner.displayName || '')!;
    if (!this.client) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }

    if (this.props.image) {
      this.capture();
    }
  }

  componentDidUpdate(prevProps: AssetScannerProps) {
    if (!this.props.image) {
      return;
    }

    const image = removeImageBase(this.props.image);
    const { imageSrc, isLoading } = this.state;
    if (
      !isLoading &&
      image !== imageSrc &&
      this.props.image !== prevProps.image
    ) {
      this.setState({ imageSrc: image });
      this.capture();
    }
  }

  async doRecognizeImageProcess(imageString: string): Promise<string[] | null> {
    const { onImageRecognizeFinish, onImageRecognizeStart } = this.props;

    if (onImageRecognizeStart) {
      onImageRecognizeStart(imageString);
    }

    const imageSrc = removeImageBase(imageString);

    this.setImageSrc(imageSrc);

    const strings = await this.recognizeImage(imageSrc);

    if (onImageRecognizeFinish) {
      onImageRecognizeFinish(strings);
    }

    return strings;
  }

  async doFetchFoundAssets(strings: string[] | null) {
    const {
      onImageRecognizeEmpty,
      onAssetFetchResult,
      getAssetsHandlerCustom,
    } = this.props;
    const { recognizeSuccess, recognizeFails } = ASNotifyTypes;

    if (strings !== null && strings.length >= 1) {
      const assets = getAssetsHandlerCustom
        ? await getAssetsHandlerCustom(strings)
        : await this.getAssetsHandlerDefault(strings);

      this.endLoading();

      this.notification(recognizeSuccess);

      if (onAssetFetchResult) {
        onAssetFetchResult(assets);
      }
    } else if (strings !== null) {
      this.endLoading();

      this.notification(recognizeFails);

      if (onImageRecognizeEmpty) {
        onImageRecognizeEmpty();
      }
    }
  }

  async capture() {
    this.startLoading();
    await this.setReady(false);

    const imageString = await this.getImage();

    if (!imageString) {
      this.endLoading();
      return;
    }

    const strings = await this.doRecognizeImageProcess(imageString);

    await this.doFetchFoundAssets(strings);
  }

  render() {
    const { isLoading, imageSrc, ready } = this.state;
    const {
      styles,
      strings,
      onError,
      button,
      cropSize,
      webcamCropOverlay,
      imageAltText,
    } = this.props;

    return (
      <Wrapper>
        <WebcamScanner
          isLoading={isLoading}
          imageSrc={imageSrc}
          imageAltText={imageAltText}
          capture={this.captureBound}
          setRef={this.setRefBound}
          onReset={this.resetSearchBound}
          strings={strings}
          styles={styles}
          onError={onError}
          button={button}
          isReady={ready}
          cropSize={cropSize}
          webcamCropOverlay={webcamCropOverlay}
        />
      </Wrapper>
    );
  }

  private startLoading() {
    const { onStartLoading } = this.props;

    this.setState({ isLoading: true });

    if (onStartLoading) {
      onStartLoading();
    }
  }

  private endLoading() {
    const { onEndLoading } = this.props;

    this.setState({ isLoading: false });

    if (onEndLoading) {
      onEndLoading();
    }
  }

  private setImageSrc(imageSrc: string = '') {
    this.setState({ imageSrc });
  }

  private prepareNotifications(): ASNotification {
    const { customNotification, enableNotification } = this.props;

    if (!enableNotification) {
      return () => false;
    }

    return customNotification || this.embeddedNotification;
  }

  private embeddedNotification(type: ASNotifyTypes) {
    const notifications: { [name in ASNotifyTypes]: any } = {
      [ASNotifyTypes.recognizeSuccess]: () => notification(ocrSuccess),
      [ASNotifyTypes.recognizeFails]: () => notification(ocrNoTextFound),
      [ASNotifyTypes.assetsFind]: () => notification(ocrAssetFind),
      [ASNotifyTypes.assetsEmpty]: () => notification(ocrAssetNotFind),
      [ASNotifyTypes.errorVideoAccess]: () => notification(ocrErrorVideo),
      [ASNotifyTypes.errorOccurred]: () => notification(ocrError),
    };

    return notifications[type]();
  }

  private async getAssets(strings: string[]): Promise<Asset[]> {
    return (await Promise.all(strings.map((s: string) => this.getAssetList(s))))
      .filter(asset => asset.length)
      .reduce((res, current) => res.concat(current));
  }

  private getAssetList(query: string): Promise<Asset[]> {
    return this.client.assets
      .list({
        filter: {
          name: query,
        },
      })
      .autoPagingToArray();
  }

  private getImage(): Promise<string> {
    const { imageSrc } = this.state;
    const { cropSize } = this.props;

    return imageSrc
      ? Promise.resolve(imageSrc)
      : this.getImageFromCanvas(cropSize);
  }

  // Made async to provide better UX for component
  private getImageFromCanvas(cropSize?: CropSize): Promise<string> {
    const { errorVideoAccess } = ASNotifyTypes;

    if (!this.video) {
      this.notification(errorVideoAccess);

      return Promise.resolve('');
    }
    const { videoHeight, videoWidth } = this.video;
    const { clientHeight, clientWidth } = scaleDomToVideoResolution(
      videoHeight,
      videoWidth,
      this.video.clientHeight,
      this.video.clientWidth
    );
    const cropSizeScaled = scaleCropSizeToVideoResolution(
      videoHeight,
      videoWidth,
      clientHeight,
      clientWidth,
      cropSize
    );
    const canvas = getCanvas(
      this.video,
      videoWidth,
      videoHeight,
      cropSizeScaled
    );

    return new Promise(resolve =>
      setTimeout(() => resolve(canvas.toDataURL()), 0)
    );
  }

  private async recognizeImage(image: string): Promise<string[] | null> {
    const { ocrKey, onOcrError, extractOcrStrings, ocrRequest } = this.props;
    const { errorOccurred } = ASNotifyTypes;

    try {
      return await ocrRequest({
        image,
        key: ocrKey,
        extractOcrStrings,
      });
    } catch (error) {
      if (onOcrError) {
        onOcrError(error);
      }

      this.notification(errorOccurred);

      this.endLoading();

      return null;
    }
  }

  private async getAssetsHandlerDefault(strings: string[]): Promise<Asset[]> {
    const { onError } = this.props;
    const { errorOccurred } = ASNotifyTypes;

    try {
      return await this.getAssets(strings);
    } catch (error) {
      this.notification(errorOccurred);

      if (onError) {
        onError(error);
      }

      return [];
    }
  }
}
