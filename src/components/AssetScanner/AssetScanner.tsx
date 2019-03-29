import React from 'react';
import styled from 'styled-components';
// import moment from 'moment';
import axios from 'axios';
import { Assets, getMetadata } from '@cognite/sdk';

// import { VAsset } from 'utils/validators';
import WebcamScanner from 'components/WebcamScanner/WebcamScanner';
// import TagList from 'components/TagList/TagList';
// import CircleButton from 'components/CircleButton/CircleButton';
import { getCanvas, extractValidStrings } from 'utils/utils';

const MainWrapperExtended = styled('div')`
  padding: 0;
  display: flex;
  flex-direction: row;
`;

// const Results = styled.div`
//   display: flex;
//   flex-direction: column;
//   overflow: auto;
//   padding: 20px 0px;
//   height: 100%;
// `;

const ocrURL = 'https://opin-api.cognite.ai/do_ocr';

export interface AssetScannerProps {
  onStringRecognize?: any;
  onStartLoading?: any;
  onEndLoading?: any;
  onAssetFind?: any;
  notifySuccessRecognize?: any;
  notifyFailRecognize?: any;
  notifyErrorOccurred?: any;
}

export interface AssetScannerState {
  notificationStatus: string;
  isLoading: boolean;
  scannedImageSrc: string;
}

class AssetScanner extends React.Component<
  AssetScannerProps,
  AssetScannerState
> {
  static defaultProps = {
    isLoading: false,
    currentScanResults: [],
    envPath: '',
  };
  static doOCRRequest = async (image: string) => {
    const options = {
      method: 'POST',
      url: ocrURL,
      data: {
        image,
      },
    };

    try {
      const result = (await axios(options)).data;

      return extractValidStrings(result.responses[0].textAnnotations);
    } catch (err) {
      return err;
    }
  };

  state: AssetScannerState = {
    notificationStatus: '',
    isLoading: false,
    scannedImageSrc: '',
  };
  video: HTMLVideoElement | null = null;

  setRefBound = this.setRef.bind(this);
  captureBound = this.capture.bind(this);

  componentDidMount() {
    this.resetSearch();
  }

  componentDidUpdate() {
    const { notificationStatus, isLoading } = this.state;

    if (notificationStatus === 'textFound' && !isLoading) {
      this.setState({
        notificationStatus: '',
      });
    }
  }

  setRef(video: HTMLVideoElement) {
    this.video = video;
  }

  resetSearch() {
    this.setState({
      notificationStatus: '',
      scannedImageSrc: '',
      isLoading: false,
    });
  }

  async capture() {
    const {
      onStartLoading,
      onStringRecognize,
      onEndLoading,
      notifySuccessRecognize,
      notifyFailRecognize,
      notifyErrorOccurred,
    } = this.props;

    if (!this.video) {
      if (notifyErrorOccurred) {
        notifyErrorOccurred({ message: 'No video provided' });
      }

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
        strings = await AssetScanner.doOCRRequest(imageSrc);
      } catch (error) {
        if (notifyErrorOccurred) {
          notifyErrorOccurred({ error, message: 'OCR request failed' });
        }

        return;
      }

      if (strings.length >= 1) {
        // strings found in image
        if (onStringRecognize) {
          onStringRecognize(strings);
        }

        if (notifySuccessRecognize) {
          notifySuccessRecognize();
        }

        this.setState({
          notificationStatus: 'textFound',
        });
      } else {
        this.setScannedImageSrc('');

        if (notifyFailRecognize) {
          notifyFailRecognize();
        }
      }

      if (onEndLoading) {
        onEndLoading();
      }

      this.endLoading();
    }
  }

  // mapAssetsToCardList(assets: VAsset[]) {
  //   return assets.map(asset => {
  //     const { id, name, description, createdTime } = asset;
  //     const detail = createdTime
  //       ? moment(createdTime || 0)
  //           .startOf('day')
  //           .fromNow()
  //       : '';
  //
  //     return {
  //       id,
  //       title: name,
  //       description,
  //       detail,
  //     };
  //   });
  // }

  render() {
    const { isLoading, scannedImageSrc } = this.state;

    return (
      <MainWrapperExtended>
        <WebcamScanner
          isLoading={isLoading}
          imageSrc={scannedImageSrc}
          capture={this.captureBound}
          setRef={this.setRefBound}
        />

        {/*{this.props.currentScanResults.length > 0 && (*/}
        {/*  <Results data-test-id="scanner-results">*/}
        {/*    <TagList*/}
        {/*      envPath={envPath}*/}
        {/*      listTitle={'Current Results'}*/}
        {/*      listData={this.mapAssetsToCardList(currentScanResults)}*/}
        {/*      renderActions={*/}
        {/*        process.env.REACT_APP_ENV !== 'production'*/}
        {/*          ? () => (*/}
        {/*              <CircleButton*/}
        {/*                onClick={e => {*/}
        {/*                  e.stopPropagation();*/}
        {/*                }}*/}
        {/*                iconType="plus"*/}
        {/*                type="success"*/}
        {/*              />*/}
        {/*            )*/}
        {/*          : () => null*/}
        {/*      }*/}
        {/*      key={123123123}*/}
        {/*    />*/}
        {/*  </Results>*/}
        {/*)}*/}
      </MainWrapperExtended>
    );
  }

  private startLoading() {
    this.setState({ isLoading: true });
  }

  private endLoading() {
    this.setState({ isLoading: false });
  }

  private setScannedImageSrc(scannedImageSrc: string) {
    this.setState({ scannedImageSrc });
  }
}

export default AssetScanner;
