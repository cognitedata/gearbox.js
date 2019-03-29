import React from 'react';
import styled from 'styled-components';

import WebcamScanner from 'components/WebcamScanner/WebcamScanner';
import { getCanvas } from 'utils/utils';
import {
  VEmptyCallback,
  VCallbackStrings,
  VOnAssetListCallback,
  VAsset,
  VSetVideoRefCallback,
} from 'utils/validators';
import { getAssetList, ocrRecognize } from 'utils/api/api';
import notification, {
  ocrSuccess,
  ocrAssetFind,
  ocrAssetNotFind,
  ocrNoTextFound,
  ocrError,
  ocrErrorVideo,
} from 'utils/notifications';

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
  customNotification?: ASNotification;
  onStringRecognize?: VCallbackStrings;
  onStartLoading?: VEmptyCallback;
  onEndLoading?: VEmptyCallback;
  onAssetFails?: VEmptyCallback;
  onAssetFind?: VOnAssetListCallback;
}

export interface AssetScannerState {
  isLoading: boolean;
  scannedImageSrc: string;
}

class AssetScanner extends React.Component<
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

  setRefBound: VSetVideoRefCallback = this.setRef.bind(this);
  captureBound: VEmptyCallback = this.capture.bind(this);

  constructor(props: AssetScannerProps) {
    super(props);

    this.prepareNotifications();
  }

  componentDidMount() {
    this.resetSearch();
  }

  setRef(video: HTMLVideoElement | null) {
    this.video = video;
  }

  async capture() {
    const {
      onAssetFind,
      onAssetFails,
      onStartLoading,
      onStringRecognize,
      onEndLoading,
    } = this.props;

    const {
      errorOccurred,
      errorVideoAccess,
      recognizeSuccess,
      recognizeFails,
    } = ASNotifyTypes;

    if (!this.video) {
      this.notification(errorVideoAccess);

      return;
    }

    const aspectRatio = this.video.videoWidth / this.video.videoHeight;
    const canvas = getCanvas(
      this.video,
      this.video.clientWidth,
      this.video.clientWidth / aspectRatio
    );
    const imageString = canvas.toDataURL();

    if (onStartLoading) {
      onStartLoading();
    }

    if (imageString !== null) {
      const imageSrc = imageString.split(',')[1];

      this.startLoading();
      this.setScannedImageSrc(imageSrc);

      let strings: any[] = [];

      try {
        // do api call to ocr
        strings = await ocrRecognize(imageSrc);
      } catch (error) {
        this.notification(errorOccurred);

        return;
      }

      if (strings.length >= 1) {
        // strings found in image
        if (onStringRecognize) {
          onStringRecognize(strings);
        }

        this.notification(recognizeSuccess);

        const assets = await this.getAssets(strings);

        if (!assets.length && onAssetFails) {
          onAssetFails();
        } else if (onAssetFind) {
          onAssetFind(assets);
        }
      } else {
        this.notification(recognizeFails);
      }

      if (onEndLoading) {
        onEndLoading();
      }

      this.setScannedImageSrc();
      this.endLoading();
    }
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
    this.setState({
      scannedImageSrc: '',
      isLoading: false,
    });
  }

  private startLoading() {
    this.setState({ isLoading: true });
  }

  private endLoading() {
    this.setState({ isLoading: false });
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

  private async getAssets(strings: string[]): Promise<VAsset[]> {
    return (await Promise.all(
      strings.map((s: string) => getAssetList({ query: s }))
    ))
      .filter(asset => asset.length)
      .reduce((res, current) => res.concat(current));
  }
}

export default AssetScanner;
