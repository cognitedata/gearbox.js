import React from 'react';
import styled from 'styled-components';

export interface WebcamCropPlaceholderProps {
  height: number;
  width: number;
  backgroundColor?: string;
  Component?: React.ComponentType;
}

export const WebcamCropPlaceholder = (props: WebcamCropPlaceholderProps) => {
  const { Component } = props;
  return (
    <>
      <Container {...props}>
        <Item {...props} />
        <Item {...props} />
        <Item {...props} />
        <Item {...props} />
        <CropperPlaceholder data-test-id="cropper-placeholder" />
        <Item {...props} />
        <Item {...props} />
        <Item {...props} />
        <Item {...props} />
      </Container>
      {Component && (
        <CustomClientOverlayWrapper>
          <Component />
        </CustomClientOverlayWrapper>
      )}
    </>
  );
};

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto ${({ width }: WebcamCropPlaceholderProps) =>
      width}px auto;
  grid-template-rows: auto ${({ height }: WebcamCropPlaceholderProps) =>
      height}px auto;
`;

const Item = styled.div`
  background-color: ${({ backgroundColor }: WebcamCropPlaceholderProps) =>
    backgroundColor ? backgroundColor : 'rgba(0,0,0,0.5)'};
  color: #fff;
`;

const CropperPlaceholder = styled.div`
  z-index: 1;
`;

const CustomClientOverlayWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
