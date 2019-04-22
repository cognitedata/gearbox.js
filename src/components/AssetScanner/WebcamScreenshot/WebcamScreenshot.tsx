import React from 'react';
import styled, { keyframes } from 'styled-components';

const animation = keyframes`
    0% {
      transform: scale(1) translate(0, 0);
      border-radius: 0;
    }
    100% {
      transform: scale(0.25) translate(-20px, -20px);
      border-radius: 5%;
    }`;

const Wrapper = styled.img`
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

interface WebcamScreenshotProps {
  src: string;
  className?: string;
}

export function WebcamScreenshot({
  src,
  className = '',
}: WebcamScreenshotProps) {
  return (
    <Wrapper
      src={`data:image/png;base64,${src}`}
      alt="Captured from webcam"
      id="freezeFrame"
      className={className}
    />
  );
}
