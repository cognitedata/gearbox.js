import { Asset, CogniteClient } from '@cognite/sdk';
import React, { Component } from 'react';
import styled from 'styled-components';

import { ocrRecognize } from '../../api';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { CropSize, EmptyCallback } from '../../interfaces';
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
import {
  ASNotification,
  ASNotifyTypes,
  AssetScannerProps,
  SetVideoRefCallback,
} from './interfaces';
import { defaultStrings, WebcamScanner } from './WebcamScanner/WebcamScanner';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: row;
`;

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
    strings: defaultStrings,
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
