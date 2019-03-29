import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const SpinContainer = styled.div`
  * {
    left: 0 !important;
    max-height: 100vh !important;
  }
`;

interface WithLoadingProps {
  isLoading: boolean;
  children: ReactElement;
  delay?: number;
  size?: 'large' | 'small' | 'default';
}

export default function WithLoading({
  isLoading,
  children,
  delay = 0,
  size = 'default',
}: WithLoadingProps) {
  if (isLoading) {
    return (
      <Spin delay={delay} size={size}>
        <SpinContainer>{children}</SpinContainer>
      </Spin>
    );
  }

  return children;
}
