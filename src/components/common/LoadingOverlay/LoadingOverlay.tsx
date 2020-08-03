// Copyright 2020 Cognite AS
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

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
        backgroundcolor={backgroundColor}
      />
    );
  }

  return null;
}

const SpinContainer = styled(Spin)<{ backgroundcolor?: string }>`
  width: 100%;
  height: 100%;
  position: absolute !important;
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  z-index: 100;

  &:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`;

SpinContainer.defaultProps = {
  backgroundcolor: 'rgba(0, 0, 0, 0.5)',
};
