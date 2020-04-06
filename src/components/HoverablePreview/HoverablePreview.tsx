import React from 'react';
import styled, { css } from 'styled-components';
import { HoverablePreviewCell } from './components/HoverablePreviewCell';
import {
  HoverablePreviewCloseButton,
  HoverablePreviewHeader,
  HoverablePreviewTitle,
} from './components/HoverablePreviewHeader';
import { HoverablePreviewProps } from './types';

export const StyledHoverablePreview = styled.div<HoverablePreviewProps>`
  width: 360px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  color: #111;
  word-break: break-word;
  ${props =>
    !props.noShadow &&
    css`
      box-shadow: 0px 10px 10px #e8e8e8;
    `}
`;

export class HoverablePreview extends React.Component<HoverablePreviewProps> {
  static Cell = HoverablePreviewCell;
  static Header = HoverablePreviewHeader;
  static Title = HoverablePreviewTitle;
  static CloseButton = HoverablePreviewCloseButton;
  render() {
    return (
      <StyledHoverablePreview>{this.props.children}</StyledHoverablePreview>
    );
  }
}
