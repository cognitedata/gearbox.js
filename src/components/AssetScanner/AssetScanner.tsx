import { Asset } from '@cognite/sdk';
import React from 'react';
import styled from 'styled-components';

import { getAssetList, ocrRecognize } from '../../api';
import {
  Callback,
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
import { getCanvas } from '../../utils/utils';
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
  image?: string
) => React.ReactNode;

export interface AssetScannerStyles {
  button: React.CSSProperties;
}

export interface AssetScannerProps {
  ocrRequest: (ocrParams: OcrRequest) => Promise<string[]>;
  ocrKey?: string;
  button?: ButtonRenderProp;
  extractOcrStrings?: (ocrResult: any) => string[];
  enableNotification?: boolean;
  customNotification?: ASNotification;
  onImageRecognizeStart?: (image: string) => void;
  onImageRecognizeFinish?: (strings: string[] | null) => void;
  onImageRecognizeEmpty?: Callback;
  onAssetFetchResult?: OnAssetListCallback;
  onStartLoading?: EmptyCallback;
  onEndLoading?: EmptyCallback;
  onOcrError?: Callback;
  onError?: Callback;
  onImageReset?: Callback;
  styles?: AssetScannerStyles;
  strings?: PureObject;
}

interface AssetScannerState {
  isLoading: boolean;
  scannedImageSrc: string;
}

export class AssetScanner extends React.Component<
  AssetScannerProps,
  AssetScannerState
> {
  static defaultProps = {
    ocrRequest: ocrRecognize,
    enableNotification: false,
  };

  notification: ASNotification = this.prepareNotifications();

  state: AssetScannerState = {
    isLoading: false,
    scannedImageSrc: '',
  };
  video: HTMLVideoElement | null = null;

  setRefBound: SetVideoRefCallback = this.setRef.bind(this);
  captureBound: EmptyCallback = this.capture.bind(this);
  resetSearchBound: EmptyCallback = this.resetSearch.bind(this);

  constructor(props: AssetScannerProps) {
    super(props);
  }

  componentDidMount() {
    this.resetSearch();
  }

  setRef(video: HTMLVideoElement | null) {
    this.video = video;
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
      scannedImageSrc: '',
      isLoading: false,
    });
  }

  async capture() {
    const {
      onImageRecognizeFinish,
      onImageRecognizeStart,
      onImageRecognizeEmpty,
      onAssetFetchResult,
    } = this.props;
    const { recognizeSuccess, recognizeFails } = ASNotifyTypes;

    this.startLoading();

    const imageString = await this.getImageFromCanvas();

    if (!imageString) {
      this.endLoading();
      return;
    }

    if (onImageRecognizeStart) {
      onImageRecognizeStart(imageString);
    }

    const imageSrc = imageString.split(',')[1];

    this.setScannedImageSrc(imageSrc);

    const strings = await this.recognizeImage(imageSrc);

    if (onImageRecognizeFinish) {
      onImageRecognizeFinish(strings);
    }

    if (strings !== null && strings.length >= 1) {
      const assets = await this.getAssetsHandler(strings);

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

  render() {
    const { isLoading, scannedImageSrc } = this.state;
    const { styles, strings, onError, button } = this.props;

    return (
      <Wrapper>
        <WebcamScanner
          isLoading={isLoading}
          imageSrc={scannedImageSrc}
          capture={this.captureBound}
          setRef={this.setRefBound}
          onReset={this.resetSearchBound}
          strings={strings}
          styles={styles}
          onError={onError}
          button={button}
        />
      </Wrapper>
    );
  }

  private startLoading() {
    const { onStartLoading } = this.props;

    if (this.video) {
      this.video.pause();
    }

    this.setState({ isLoading: true });

    if (onStartLoading) {
      onStartLoading();
    }
  }

  private endLoading() {
    const { onEndLoading } = this.props;

    if (this.video) {
      this.video.play();
    }

    this.setState({ isLoading: false });

    if (onEndLoading) {
      onEndLoading();
    }
  }

  private setScannedImageSrc(scannedImageSrc: string = '') {
    this.setState({ scannedImageSrc });
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
    return (await Promise.all(
      strings.map((s: string) => getAssetList({ query: s }))
    ))
      .filter(asset => asset.length)
      .reduce((res, current) => res.concat(current));
  }

  // Made async to provide better UX for component
  private getImageFromCanvas(): Promise<string> {
    const { errorVideoAccess } = ASNotifyTypes;

    if (!this.video) {
      this.notification(errorVideoAccess);

      return Promise.resolve('');
    }

    const aspectRatio = this.video.videoWidth / this.video.videoHeight;
    const canvas = getCanvas(
      this.video,
      this.video.clientWidth,
      this.video.clientWidth / aspectRatio
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

      return null;
    }
  }

  private async getAssetsHandler(strings: string[]): Promise<Asset[]> {
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
