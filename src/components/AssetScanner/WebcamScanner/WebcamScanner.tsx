import React from 'react';
import styled from 'styled-components';

import {
  Callback,
  EmptyCallback,
  PureObject,
  SetVideoRefCallback,
} from '../../../interfaces';
import { CropSize } from '../../../utils/utils';
import { LoadingOverlay } from '../../common/LoadingOverlay/LoadingOverlay';
import { ButtonRenderProp } from '../AssetScanner';
import { Webcam } from '../Webcam/Webcam';
import { WebcamCropPlaceholder } from '../WebcamCropPlaceholder/WebcamCropPlaceholder';
import { WebcamScreenshot } from '../WebcamScreenshot/WebcamScreenshot';

const CameraButton = styled.button`
  position: absolute;
  top: 50%;
  left: 25px;
  border-radius: 100%;
  width: 75px;
  height: 75px;
  outline: none;
  transform: translateY(-50%);
  border: 1px solid #fff;
  box-sizing: border-box;
  cursor: pointer;
  opacity: .9
  font-weight: 600;
  :hover {
    opacity: 1;
  }
  z-index: 9999
`;

const Wrapper = styled.div`
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const defaultStrings: PureObject = {
  reset: 'Reset',
};

export interface WebcamScannerStyles {
  button: React.CSSProperties;
}

interface WebcamScannerProps {
  isLoading: boolean;
  capture: EmptyCallback;
  setRef: SetVideoRefCallback;
  button?: ButtonRenderProp;
  imageSrc?: string;
  onReset?: EmptyCallback;
  styles?: WebcamScannerStyles;
  strings?: PureObject;
  onError?: Callback;
  isReady?: boolean;
  cropSize?: CropSize;
}

export function WebcamScanner({
  capture,
  imageSrc,
  isLoading = false,
  setRef,
  onReset,
  styles,
  strings = {},
  onError,
  button,
  isReady = true,
  cropSize,
}: WebcamScannerProps) {
  const onCaptureClick = () => {
    console.log('Clicked');
    if (isReady && capture) {
      capture();
    } else if (!isReady && onReset) {
      onReset();
    }
  };

  const resultStrings = { ...defaultStrings, ...strings };

  return (
    <Wrapper>
      <LoadingOverlay size={'large'} isLoading={isLoading} />
      {imageSrc && <WebcamScreenshot src={imageSrc} />}
      <Webcam
        audio={false}
        setRef={setRef}
        className="camera"
        onError={onError}
        style={imageSrc ? { opacity: 0, visability: 'hidden' } : {}}
      />
      {!isLoading &&
        (button ? (
          button(onCaptureClick, isReady)
        ) : (
          <CameraButton
            onClick={onCaptureClick}
            data-test-id="scanner-camera-button"
            style={styles && styles.button}
          >
            {!isReady ? resultStrings.reset : ''}
          </CameraButton>
        ))}
      {cropSize && !imageSrc && (
        <WebcamCropPlaceholder
          height={cropSize.height}
          width={cropSize.width}
        />
      )}
    </Wrapper>
  );
}
