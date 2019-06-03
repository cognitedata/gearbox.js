import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

const SpinContainer = styled(Spin)<{ backgroundColor?: string }>`
  width: 100%;
  height: 100%;
  position: absolute !important;
  background-color: ${({ backgroundColor }) => backgroundColor};
  z-index: 100;

  &:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`;

SpinContainer.defaultProps = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

interface LoadingOverlayProps {
  isLoading: boolean;
  delay?: number;
  size?: 'large' | 'small' | 'default';
  backgroundColor?: string;
}

export function LoadingOverlay({
  isLoading,
  backgroundColor,
  delay = 0,
  size = 'default',
}: LoadingOverlayProps) {
  if (isLoading) {
    return (
      <SpinContainer
        delay={delay}
        size={size}
        backgroundColor={backgroundColor}
      />
    );
  }

  return null;
}
