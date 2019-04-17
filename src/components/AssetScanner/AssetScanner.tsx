import React from 'react';
import styled from 'styled-components';
import { Asset } from '@cognite/sdk';

import { WebcamScanner } from '../WebcamScanner/WebcamScanner';
import { getCanvas } from '../../utils';
import {
  EmptyCallback,
  StringsCallback,
  OnAssetListCallback,
  SetVideoRefCallback,
} from '../../interfaces';
import { getAssetList, ocrRecognize } from '../../api';
import {
  notification,
  ocrSuccess,
  ocrAssetFind,
  ocrAssetNotFind,
  ocrNoTextFound,
  ocrError,
  ocrErrorVideo,
} from '../../utils';

const Wrapper = styled.div`
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

type ASNotification = (type: ASNotifyTypes) => void;

export interface AssetScannerProps {
  ocrUrl?: string;
  ocrKey?: string;
  customNotification?: ASNotification;
  onStringRecognize?: StringsCallback;
  onStartLoading?: EmptyCallback;
  onEndLoading?: EmptyCallback;
  onAssetEmpty?: EmptyCallback;
  onAssetFind?: OnAssetListCallback;
  onUnauthorized?: any;
}

export interface AssetScannerState {
  isLoading: boolean;
  scannedImageSrc: string;
}

export class AssetScanner extends React.Component<
  AssetScannerProps,
  AssetScannerState
> {
  static defaultProps = {
    customNotifications: false,
    isLoading: false,
    currentScanResults: [],
    envPath: '',
  };

  notification: ASNotification = this.prepareNotifications();

  state: AssetScannerState = {
    isLoading: false,
    scannedImageSrc: '',
  };
  video: HTMLVideoElement | null = null;

  setRefBound: SetVideoRefCallback = this.setRef.bind(this);
  captureBound: EmptyCallback = this.capture.bind(this);

  constructor(props: AssetScannerProps) {
    super(props);
  }

  componentDidMount() {
    this.resetSearch();
  }

  setRef(video: HTMLVideoElement | null) {
    this.video = video;
  }

  async capture() {
    const { onStartLoading, onStringRecognize, onEndLoading } = this.props;
    const { recognizeSuccess, recognizeFails } = ASNotifyTypes;
    const imageString = this.getImageFromCanvas();

    if (!imageString) {
      return;
    }

    if (onStartLoading) {
      onStartLoading();
    }

    const imageSrc = imageString.split(',')[1];

    this.startLoading();
    this.setScannedImageSrc(imageSrc);

    const strings = await this.recognizeImage(imageSrc);

    if (strings !== null && strings.length >= 1) {
      if (onStringRecognize) {
        onStringRecognize(strings);
      }

      await this.getAssetsHandler(strings);

      this.notification(recognizeSuccess);
    } else if (strings !== null) {
      this.notification(recognizeFails);
    }

    if (onEndLoading) {
      onEndLoading();
    }

    this.resetSearch();
  }

  render() {
    const { isLoading, scannedImageSrc } = this.state;

    return (
      <Wrapper>
        <WebcamScanner
          isLoading={isLoading}
          imageSrc={scannedImageSrc}
          capture={this.captureBound}
          setRef={this.setRefBound}
        />
      </Wrapper>
    );
  }

  private resetSearch() {
    if (!this.video) {
      return;
    }

    this.setState({
      scannedImageSrc: '',
      isLoading: false,
    });
  }

  private startLoading() {
    this.setState({ isLoading: true });
  }

  private setScannedImageSrc(scannedImageSrc: string = '') {
    this.setState({ scannedImageSrc });
  }

  private prepareNotifications(): ASNotification {
    const { customNotification } = this.props;

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

  private getImageFromCanvas(): string {
    const { errorVideoAccess } = ASNotifyTypes;

    if (!this.video) {
      this.notification(errorVideoAccess);

      return '';
    }

    const aspectRatio = this.video.videoWidth / this.video.videoHeight;
    const canvas = getCanvas(
      this.video,
      this.video.clientWidth,
      this.video.clientWidth / aspectRatio
    );

    return canvas.toDataURL();
  }

  private async recognizeImage(image: string): Promise<string[] | null> {
    const { ocrUrl, ocrKey, onUnauthorized } = this.props;
    const { errorOccurred } = ASNotifyTypes;
    let strings: string[] = [];

    try {
      strings = await ocrRecognize({
        image,
        url: ocrUrl,
        key: ocrKey,
      });
    } catch (error) {
      if (onUnauthorized) {
        onUnauthorized(error);
      }

      this.notification(errorOccurred);

      return null;
    }

    return strings;
  }

  private async getAssetsHandler(strings: string[]) {
    const { onAssetEmpty, onAssetFind, onUnauthorized } = this.props;

    try {
      const assets = await this.getAssets(strings);

      if (assets.length === 0 && onAssetEmpty) {
        onAssetEmpty();
      } else if (assets.length && onAssetFind) {
        onAssetFind(assets);
      }
    } catch (error) {
      if (error.status && onUnauthorized) {
        const { status, message } = error;

        onUnauthorized({ status, message, error });
      }
    }
  }
}
