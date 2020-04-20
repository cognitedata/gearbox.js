import { Icon } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { HPIconProps } from '../../types';

const StyledHoverablePreviewHeader = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #1f1f1f;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 20px 16px;
`;

const StyledHoverablePreviewTitle = styled.span`
  align-self: flex-start;
`;
const StyledIcon = styled.div<HPIconProps>`
  margin-left: 5px;
  padding: 0;
  cursor: help;
`;

export const HoverablePreviewHeader = (props: any) => (
  <StyledHoverablePreviewHeader className="hp-header">
    {props.children}
  </StyledHoverablePreviewHeader>
);
export const HoverablePreviewTitle = (props: any) => (
  <StyledHoverablePreviewTitle className="hp-title">
    {props.children}
  </StyledHoverablePreviewTitle>
);
export const HoverablePreviewCloseButton = () => (
  <StyledIcon className="hp-close">
    <Icon type="close" />
  </StyledIcon>
);
export const HoverablePreviewDisplayIcon = (props: HPIconProps) => (
  <StyledIcon {...props} className="hp-displayicon">
    <Icon type="question-circle" />
  </StyledIcon>
);
