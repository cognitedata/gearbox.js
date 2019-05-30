import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.img`
  width: 100%;
  max-width: 100%;
  position: absolute;
  min-width: 150px;
  top: 50%;
  transform: translate(0, -50%);
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
