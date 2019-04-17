import React from 'react';
import styled from 'styled-components';

import { Webcam } from '../Webcam/Webcam';
import { WebcamScreenshot } from '../WebcamScreenshot/WebcamScreenshot';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { SetVideoRefCallback, EmptyCallback } from '../../interfaces';

const CameraButton = styled.button`
  position: absolute;
  bottom: 20px;
  border-radius: 100%;
  width: 75px;
  height: 75px;
  outline: none;

  @media (orientation: landscape) and (max-width: 1000px) {
    top: 50%;
    right: 20px;
    bottom: auto;
    left: auto;
    transform: translateY(-50%);
  }
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

interface WebcamScannerProps {
  isLoading: boolean;
  capture: EmptyCallback;
  setRef: SetVideoRefCallback;
  imageSrc?: string;
}

export function WebcamScanner({
  capture,
  imageSrc,
  isLoading = false,
  setRef,
}: WebcamScannerProps) {
  const onCaptureClick = () => {
    if (capture) {
      capture();
    }
  };

  return (
    <Wrapper>
      <LoadingOverlay size={'large'} isLoading={isLoading} />
      {imageSrc && isLoading && <WebcamScreenshot src={imageSrc} />}
      <Webcam audio={false} setRef={setRef} className="camera" />
      {!imageSrc && !isLoading && (
        <CameraButton
          onClick={onCaptureClick}
          data-test-id="scanner-camera-button"
        />
      )}
    </Wrapper>
  );
}
