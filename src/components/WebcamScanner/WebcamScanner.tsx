import React from 'react';
import styled, { keyframes } from 'styled-components';

import Webcam from 'components/Webcam/Webcam';
// import WithLoading from 'components/WithLoading/WithLoading';

const CameraButton = styled.button`
  position: absolute;
  bottom: 20px;
  border-radius: 100%;
  width: 75px;
  height: 75px;

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

// const FreezeFrame = styled.img`
//   width: 30%;
//   max-width: 300px;
//   position: absolute;
//   bottom: 10px;
//   right: 10px;
//   min-width: 150px;
// `;

const animation = keyframes`
    0% {
      transform: scale(1) translate(0, 0);
      border-radius: 0;
    }
    100% {
      transform: scale(0.25) translate(-20px, -20px);
      border-radius: 5%;
    }`;

const FreezeFrame = styled.img`
  width: 100%;
  max-width: 100%;
  position: absolute;
  min-width: 150px;
  top: 0;
  transform: scale(0.25) translate(-20px, -20px);
  border-radius: 5%;
  transform-origin: right bottom;
  animation: 0.5s ${animation} linear;
`;

interface WebcamScannerProps {
  isLoading: boolean;
  capture: any;
  setRef: any;
  imageSrc?: string;
}

function WebcamScanner({
  capture,
  imageSrc,
  isLoading = false,
  setRef,
}: WebcamScannerProps) {
  const renderScreen = () => {
    return imageSrc && isLoading ? (
      <FreezeFrame
        src={`data:image/png;base64,${imageSrc}`}
        alt="Captured from webcam"
        id="freezeFrame"
        className=""
      />
    ) : null;
  };

  const onCaptureClick = () => {
    if (capture) {
      capture();
    }
  };

  return (
    <Wrapper>
      {/*<WithLoading isLoading={isLoading && !!imageSrc} size="large"></WithLoading>*/}
      {renderScreen()}
      <Webcam audio={false} setRef={setRef} className="camera" />
      {!imageSrc && (
        <CameraButton
          onClick={onCaptureClick}
          data-test-id="scanner-camera-button"
        />
      )}
    </Wrapper>
  );
}

export default WebcamScanner;
