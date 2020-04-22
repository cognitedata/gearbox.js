import React from 'react';
import styled from 'styled-components';
import { HoverablePreviewCell } from './components/HoverablePreviewCell';
import {
  HoverablePreviewCloseButton,
  HoverablePreviewDisplayIcon,
  HoverablePreviewHeader,
  HoverablePreviewTitle,
  HoverablePreviewLoading,
} from './components/HoverablePreviewElements';
import { HPProps } from './types';

const StyledHoverableWrapper = styled.div<{ show: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
`;
const StyledHoverableAppend = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
const StyledHoverablePreview = styled.div<HPProps>`
  z-index: 1;
  position: absolute;
  box-sizing: border-box;
  width: 360px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  background-color: #fff;
  color: #111;
  word-break: break-word;
  ${({ noShadow }) => !noShadow && 'box-shadow: 0px 10px 10px #e8e8e8'};
  ${({ displayOn, show }) => (displayOn && `visibility: ${show ? 'show' : 'hidden'}`)};
  ${({ displayOn, show }) => (displayOn && `opacity: ${show ? '1' : '0'}`)};
  ${({ fadeIn, show }) => (fadeIn && `transform: ${show ? 'translate(5px, 0px)' : 'translate(0,0)'}`)};
  transition: ${({ fadeIn }) => (fadeIn ? 'all .25s ease-out' : 'none')};
`;

export class HoverablePreview extends React.Component<
  HPProps,
  { show: boolean, 
    left: number, 
    top: number,
  }
> {
  static Cell = HoverablePreviewCell;
  static Header = HoverablePreviewHeader;
  static Title = HoverablePreviewTitle;
  static Loading = HoverablePreviewLoading;
  static DisplayIcon = HoverablePreviewDisplayIcon;
  static CloseButton = HoverablePreviewCloseButton;
  private wrapperRef: any;
  private appendRef: any;
  private previewRef: any;
  private iconRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      left: 0,
      top: 0,
    };
    this.wrapperRef = React.createRef();
    this.appendRef = React.createRef();
    this.previewRef = React.createRef();
    this.iconRef = React.createRef();
  }
  
  isShown = (show: boolean) => this.setState({ show });
  handleClickOutside = (event: any) => {
    if (this.state.show && !this.iconRef.current.contains(event.target) && !this.previewRef.current.contains(event.target)) {
      this.isShown(false);
    }
  };
  setPreview = () => {
    const iconRect = this.iconRef.current.getBoundingClientRect();
    const iconWidth = this.iconRef.current.offsetWidth;
    const iconHeight = this.iconRef.current.offsetHeight;
    const previewWidth = this.previewRef.current.offsetWidth;
    const previewHeight = this.previewRef.current.offsetHeight;
    const left = iconRect.left + previewWidth <= document.documentElement.clientWidth
      ? iconRect.left + window.scrollX + 1.5*iconWidth
      : iconRect.left + window.scrollX - 0.5*iconWidth - previewWidth;
    const top = iconRect.top + previewHeight <= document.documentElement.clientHeight
      ? iconRect.top + window.scrollY
      : iconRect.top + window.scrollY - previewHeight + iconHeight;
    this.setState({ left, top });
  }

  componentDidMount = () => {
    if (!this.props.displayOn) {
      this.setState({ show: true });
    }
    if (this.props.displayOn) {
      document.body.appendChild(this.appendRef.current);
      window.addEventListener('resize', this.setPreview);
      this.setPreview();
    }
    if (this.props.displayOn === 'click') {
      document.addEventListener('click', this.handleClickOutside);
    }
  };
  componentWillUnmount = () => {
    if (this.props.displayOn) {
      window.removeEventListener('resize', this.setPreview);
      document.body.removeChild(this.appendRef.current);
    }
    this.props.displayOn === 'click' &&
    document.removeEventListener('click', this.handleClickOutside);
  }
  
  render() {
    const { noShadow, displayOn, fadeIn, icon } = this.props;
    return (
      displayOn
        ? 
        <StyledHoverableWrapper
          ref={this.wrapperRef}  
          className="hp-wrapper"
          show={this.state.show}
        >
          <HoverablePreview.DisplayIcon
            ref={this.iconRef}
            onMouseOver={() => displayOn === 'hover' && this.isShown(true)}
            onMouseLeave={() => displayOn === 'hover' && this.isShown(false)}
            onClick={() =>
              displayOn === 'click' && this.isShown(!this.state.show)
            }
            style={!displayOn ? { display: 'none' } : {}}
            icon={icon}
          />
          <StyledHoverableAppend 
            ref={this.appendRef}
          >
            <StyledHoverablePreview
              className="hp-preview"
              ref={this.previewRef}
              noShadow={noShadow}
              displayOn={displayOn}
              fadeIn={fadeIn}
              show={this.state.show}
              style={displayOn && { left: this.state.left, top: this.state.top }}
            >
              {this.props.children}
            </StyledHoverablePreview>
          </StyledHoverableAppend>
        </StyledHoverableWrapper>
        : 
        <StyledHoverablePreview
            className="hp-preview"
            ref={this.previewRef}
            noShadow={noShadow}
          >
          {this.props.children}
        </StyledHoverablePreview>
    );
  }
}
