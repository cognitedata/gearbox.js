import React from 'react';
import styled from 'styled-components';

export interface WebcamCropPlaceholderProps {
  height: number;
  width: number;
}

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto ${(props: WebcamCropPlaceholderProps) =>
      props.width}px auto;
  grid-template-rows: auto ${(props: WebcamCropPlaceholderProps) =>
      props.height}px auto;
`;

const Item = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
`;

const CropperPlaceholder = styled.div``;

export const WebcamCropPlaceholder = (props: WebcamCropPlaceholderProps) => {
  return (
    <Container {...props}>
      <Item />
      <Item />
      <Item />
      <Item />
      <CropperPlaceholder data-test-id="cropper-placeholder" />
      <Item />
      <Item />
      <Item />
      <Item />
    </Container>
  );
};
