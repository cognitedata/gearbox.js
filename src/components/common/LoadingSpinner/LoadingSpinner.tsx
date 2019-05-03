import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

const SpinContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const LoadingSpinner: React.SFC = () => (
  <SpinContainer>
    <Spin />
  </SpinContainer>
);
