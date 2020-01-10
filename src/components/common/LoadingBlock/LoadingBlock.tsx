import React, { FC } from 'react';
import styled from 'styled-components';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';

interface LoadingBlockProps {
  height?: string;
  backgroundColor?: string;
}

export const LoadingBlock: FC<LoadingBlockProps> = ({
  height,
  backgroundColor,
}) => (
  <SpinnerContainer height={height}>
    <LoadingOverlay isLoading={true} backgroundColor={backgroundColor} />
  </SpinnerContainer>
);

LoadingBlock.defaultProps = {
  height: '250px',
  backgroundColor: 'none',
};

const SpinnerContainer = styled.div<{ height?: string }>`
  position: relative;
  height: ${({ height }) => height};
`;
