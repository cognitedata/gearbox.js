import React from 'react';
import styled from 'styled-components';

interface WebcamScreenshotProps {
  src: string;
  altText?: string;
  className?: string;
}

export function WebcamScreenshot({
  src,
  altText = 'Captured from webcam',
  className = '',
}: WebcamScreenshotProps) {
  return (
    <Wrapper>
      <ImgWrapper
        src={`data:image/png;base64,${src}`}
        alt={altText}
        id="freezeFrame"
        className={className}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
  position: absolute;
  min-width: 150px;
  top: 50%;
  transform: translate(0, -50%);
`;

// Ensures Img is displayed as it is cropped. Not being stretched in any direction
const ImgWrapper = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
