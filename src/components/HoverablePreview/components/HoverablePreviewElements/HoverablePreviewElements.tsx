import { Icon } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { HPBasicProps, HPIconProps } from '../../types';

const StyledHoverablePreviewHeader = styled.div<HPBasicProps>`
  width: 100%;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  font-family: 'Proxima Nova', Verdana, Geneva, Tahoma, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #1f1f1f;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 20px 16px;
`;

const StyledHoverablePreviewTitle = styled.span<HPBasicProps>`
  align-self: flex-start;
`;
const StyledIcon = styled.div<HPBasicProps>`
  margin-left: 5px;
  padding: 0;
  cursor: help;
`;

export const HoverablePreviewHeader = (props:any) => <StyledHoverablePreviewHeader className="hp-header">{props.children}</StyledHoverablePreviewHeader>
export const HoverablePreviewTitle = (props:any) => <StyledHoverablePreviewTitle className="hp-title">{props.children}</StyledHoverablePreviewTitle>
export const HoverablePreviewCloseButton = () => <Icon type="close" className="hp-close" />;
export const HoverablePreviewHoverIcon = (props:HPIconProps) =>
  <StyledIcon 
    {...props}
    className="hp-hovericon"
  >
    <Icon type="question-circle" />
  </StyledIcon>;
