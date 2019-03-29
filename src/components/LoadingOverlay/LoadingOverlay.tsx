import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const SpinContainer = styled(Spin)`
  width: 100%;
  height: 100%;
  position: absolute !important;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;

  &:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`;

interface LoadingOverlayProps {
  isLoading: boolean;
  delay?: number;
  size?: 'large' | 'small' | 'default';
}

export function LoadingOverlay({
  isLoading,
  delay = 0,
  size = 'default',
}: LoadingOverlayProps) {
  if (isLoading) {
    return <SpinContainer delay={delay} size={size} />;
  }

  return null;
}
