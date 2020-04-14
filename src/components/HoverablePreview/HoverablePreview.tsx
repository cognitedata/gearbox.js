import React from 'react';
import styled, { css } from 'styled-components';
import { HoverablePreviewCell } from './components/HoverablePreviewCell';
import {
  HoverablePreviewCloseButton,
  HoverablePreviewHeader,
  HoverablePreviewTitle,
  HoverablePreviewHoverIcon,
} from './components/HoverablePreviewElements';
import { HPProps } from './types';

const StyledHoverableWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledHoverablePreview = styled.div<HPProps>`
  position: absolute;
  left: ${props => props.displayOn ? '30px' : '0'};
  width: 360px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  background-color: #fff;
  color: #111;
  word-break: break-word;
  ${props =>
    !props.noShadow &&
    css`
      box-shadow: 0px 10px 10px #e8e8e8;
    `}
`;

export class HoverablePreview extends React.Component<HPProps, { show: boolean }> {
  static Cell = HoverablePreviewCell;
  static Header = HoverablePreviewHeader;
  static Title = HoverablePreviewTitle;
  static DisplayIcon = HoverablePreviewHoverIcon;
  static CloseButton = HoverablePreviewCloseButton;

  constructor(props:any) {
    super(props);
    this.state = { 
      show: false,
    }
    this.isShown = this.isShown.bind(this);
  }

  componentDidMount = () => {
    !this.props.displayOn && this.setState({ show: true });
  }

  isShown = (show:boolean) => {
    this.setState({ show });
    console.log(show);
  };

  render() {
    const { noShadow, displayOn } = this.props;
    return (
      <StyledHoverableWrapper
        className="hp-wrapper"
      >
        <HoverablePreview.DisplayIcon
          onMouseOver={() => displayOn==='hover' && this.isShown(true)}
          onMouseLeave={() => displayOn==='hover' && this.isShown(false)}
          onClick={() => displayOn==='click' && this.isShown(!this.state.show)}
          style={ !displayOn ? { display: 'none' } : {}}
        />
        <StyledHoverablePreview 
          className="hp-preview"
          noShadow={ noShadow }
          displayOn={ displayOn }
          style={ this.state.show ? { display: 'flex' } : { display: 'none' }}
        >
          {this.props.children}
        </StyledHoverablePreview>
      </StyledHoverableWrapper>      
    );
  }
}
