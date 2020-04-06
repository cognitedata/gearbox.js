import { Icon } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { HPBasicProps } from '../../types';

export const HoverablePreviewHeader = styled.div<HPBasicProps>`
  width: 100%;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 20px 16px;
`;

export const HoverablePreviewTitle = styled.span<HPBasicProps>`
  align-self: flex-start;
`;
export const StyledIcon = styled(Icon)<HPBasicProps>`
  margin-left: 5px;
`;
export const HoverablePreviewCloseButton = () => <Icon type="close" />;
