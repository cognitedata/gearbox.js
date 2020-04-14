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

const StyledHoverableWrapper = styled.div<{show:boolean}>`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledHoverablePreview = styled.div<HPProps>`
  position: absolute;
  left: ${props => (props.displayOn ? '30px' : '0')};
  opacity: ${props => (props.show ? "1" : "0")};
  z-index: ${props => (props.show ? "100" : "auto")};
  width: 360px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  background-color: #fff;
  color: #111;
  word-break: break-word;
  transition: ${props => (props.fadeIn ? "opacity .2s" : "none")};
  ${props => (
    !props.noShadow &&
    css`
      box-shadow: 0px 10px 10px #e8e8e8;
    `)}
`;

export class HoverablePreview extends React.Component<HPProps, { show: boolean }> {
  static Cell = HoverablePreviewCell;
  static Header = HoverablePreviewHeader;
  static Title = HoverablePreviewTitle;
  static DisplayIcon = HoverablePreviewHoverIcon;
  static CloseButton = HoverablePreviewCloseButton;
  private wrapperRef: any;

  constructor(props:any) {
    super(props);
    this.state = { 
      show: false,
    }
    this.isShown = this.isShown.bind(this);
    this.wrapperRef = React.createRef();
  };
  isShown = (show:boolean) => this.setState({ show });
  handleClickOutside = (event:any) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ show: false });
    }
  };
  componentDidMount = () => {
    !this.props.displayOn && this.setState({ show: true });
    this.props.displayOn === "click" && document.addEventListener('mousedown', this.handleClickOutside);
  };
  componentWillUnmount = () => this.props.displayOn === "click" && document.removeEventListener('mousedown', this.handleClickOutside);
  render() {
    const { noShadow, displayOn, fadeIn } = this.props;
    return (
      <StyledHoverableWrapper
        className="hp-wrapper"
        show={this.state.show}
        ref={this.wrapperRef}
      >
        <HoverablePreview.DisplayIcon
          onMouseOver={() => displayOn==='hover' && this.isShown(true)}
          onMouseLeave={() => displayOn==='hover' && this.isShown(false)}
          onClick={() => displayOn==='click' && this.isShown(!this.state.show)}
          style={ !displayOn ? { display: 'none' } : {}}
        />
        <StyledHoverablePreview 
          noShadow={ noShadow }
          displayOn={ displayOn }
          fadeIn={ fadeIn }
          show={ this.state.show }
          className="hp-preview"
        >
          {this.props.children}
        </StyledHoverablePreview>
      </StyledHoverableWrapper>      
    );
  }
}
