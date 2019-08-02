import Icon from 'antd/lib/icon';
import PinchZoom from 'pinch-zoom-js';
import React, { KeyboardEvent, RefObject } from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKContext } from '../../context/clientSDKContext';
import {
  Conditions,
  CustomClassNames,
  PinchZoomInterface,
  ZoomCenter,
} from '../../interfaces';
import * as CustomIcon from './Icons';
import SVGViewerSearch from './SVGViewerSearch';
import { getDocumentDownloadLink } from './utils';

const zoomLevel = 0.7;
const wheelZoomLevel = 0.15;
const currentAssetClassName = 'current-asset';

export interface SvgViewerProps {
  // CDF fileId to fetch svg-document
  documentId: number;
  // List of classes and conditions on when they should be applied for equipment
  metadataClassesConditions?: Conditions[];
  // Document title
  title?: string;
  // Document description
  description?: string;
  // Display text with stroke-width: 0
  showOverlappedText?: boolean;
  // Override default colors with custom classNames
  customClassNames?: CustomClassNames;
  // Condition to locate and highlight current asset during first render
  isCurrentAsset?: (metadataNode: Element) => boolean;
  // Viewer close callback
  handleCancel?: () => void;
  // Zoom callback
  handleAnimateZoom?: ({
    zoomProgress,
    source,
    zoomCenter,
  }: {
    zoomProgress: number;
    source: string;
    zoomCenter?: ZoomCenter;
  }) => void;
  // Item click callback
  handleItemClick?: (metadataNode: HTMLElement) => void;
  // Error document load callback
  handleDocumentLoadError?: (error: Error) => void;
}

interface SvgViewerState {
  isSearchVisible: boolean;
  isSearchFocused: boolean;
  width: number;
  handleKeyDown: boolean;
}

export class SVGViewer extends React.Component<SvgViewerProps, SvgViewerState> {
  static contextType = ClientSDKContext;
  context!: React.ContextType<typeof ClientSDKContext>;
  prevMoveDistanceX: number = 0;
  prevMoveDistanceY: number = 0;
  dragging: boolean = false;
  startMouse!: ZoomCenter;
  pinchZoomInstance!: PinchZoomInterface;
  inputWrapper: RefObject<HTMLInputElement>;
  svg!: SVGSVGElement;
  pinchZoom: React.RefObject<HTMLDivElement>;
  pinchZoomContainer: React.RefObject<HTMLDivElement>;
  svgParentNode: React.RefObject<HTMLDivElement>;
  constructor(props: SvgViewerProps) {
    super(props);
    this.state = {
      isSearchVisible: false,
      isSearchFocused: false,
      handleKeyDown: false,
      width: window.innerWidth,
    };

    this.pinchZoom = React.createRef();
    this.pinchZoomContainer = React.createRef();
    this.svgParentNode = React.createRef();
    this.inputWrapper = React.createRef();
  }

  componentDidMount() {
    if (!this.context) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
    this.presetSVG();
    window.addEventListener('resize', this.initiateScale);
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate(prevProps: SvgViewerProps) {
    if (this.svg) {
      this.setCustomClasses();
    }

    if (prevProps.documentId !== this.props.documentId) {
      this.presetSVG();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.initiateScale);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render() {
    const { title, description, customClassNames = {} } = this.props;
    const isDesktop = this.state.width > 992;

    return (
      <SVGViewerContainer
        onClick={this.onContainerClick}
        onKeyDown={this.handleKeyDown}
      >
        <input
          type="text"
          onBlur={this.onContainerBlur}
          onFocus={this.onContainerFocus}
          ref={this.inputWrapper}
          style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
        />
        <SvgNode
          ref={this.svgParentNode}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          // disable tap to search functionality for Android
          // https://developers.google.com/web/updates/2015/10/tap-to-search
          tabIndex={-1}
          onWheel={this.handleTrackpadZoom}
          customClassNames={customClassNames}
          data-test-id="svg-viewer"
        >
          <StyledHeaderContainer>
            <MobileModalClose
              data-test-id="close-svgviewer-btn"
              onClick={this.handleCloseModal}
            >
              <Icon type="arrow-left" />
            </MobileModalClose>
            <StyledHeaderTitle>
              {title && <StyledFileName>{title}</StyledFileName>}
              {description && (
                <StyledHeaderDescription>{description}</StyledHeaderDescription>
              )}
            </StyledHeaderTitle>
            <StyledHeaderButtonsContainer>
              <ModalButton
                onClick={this.zoomIn}
                data-test-id="zoom-in-svgviewer"
              >
                <CustomIcon.ZoomIn />
              </ModalButton>
              <ModalButton
                onClick={this.zoomOut}
                data-test-id="zoom-out-svgviewer"
              >
                <CustomIcon.ZoomOut />
              </ModalButton>
              <ModalButton
                onClick={this.openSearch}
                data-test-id="search-button-svgviewer"
              >
                <CustomIcon.FindInPage />
              </ModalButton>
              <CloseModalButton
                onClick={this.handleCloseModal}
                data-test-id="close-svgviewer-btn"
              >
                <CustomIcon.Close />
              </CloseModalButton>
            </StyledHeaderButtonsContainer>
          </StyledHeaderContainer>
          <SVGViewerSearch
            visible={this.state.isSearchVisible}
            svg={this.svg}
            openSearch={this.openSearch}
            zoomOnCurrentAsset={this.zoomOnCurrentAsset}
            handleCancelSearch={this.handleCancelSearch}
            addCssClassesToMetadataContainer={
              this.addCssClassesToMetadataContainer
            }
            addCssClassesToSvgText={this.addCssClassesToSvgText}
            onFocus={this.handleSearchFocus}
            onBlur={this.handleSearchBlur}
            isDesktop={isDesktop}
            searchClassName={customClassNames.searchResults}
            currentSearchClassName={customClassNames.currentSearchResult}
          />
          <div ref={this.pinchZoomContainer}>
            <div
              ref={this.pinchZoom}
              onTouchStart={this.onTouchStart}
              onTouchEnd={this.onTouchEnd}
            />
          </div>
          {!isDesktop && !this.state.isSearchFocused ? (
            <ModalMobileFooter>
              <MobileSearchButton
                data-test-id="search-button-svgviewer"
                onClick={this.openSearch}
              >
                <CustomIcon.FindInPage />
              </MobileSearchButton>
            </ModalMobileFooter>
          ) : null}
        </SvgNode>
      </SVGViewerContainer>
    );
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
    });
  };

  presetSVG = async () => {
    const { documentId, customClassNames } = this.props;
    let svgString;
    try {
      svgString = await getDocumentDownloadLink(this.context!, documentId);
    } catch (e) {
      if (this.props.handleDocumentLoadError) {
        this.props.handleDocumentLoadError(e);
      }
    }
    if (svgString) {
      const parser = new DOMParser();
      const svgFromUrl = parser.parseFromString(svgString, 'image/svg+xml');
      // if during parsing there was an error, svg will be rendered
      // inside html tag until the line where an error occured,
      // so we need to cover that case and show only svg
      this.svg = svgFromUrl.getElementsByTagName('svg')[0];
      if (this.svg) {
        this.initiateScale();
        this.initPinchToZoom();
        this.initAttributesForMetadataContainer();
        this.setCustomClasses();
        this.svg.addEventListener('click', this.handleItemClick);
        this.zoomOnCurrentAsset(
          document.querySelector(
            `.${currentAssetClassName || (customClassNames || {}).currentAsset}`
          )
        );
      }
    }
  };

  setCustomClasses = () => {
    if (this.props.isCurrentAsset) {
      this.addCssClassesToMetadataContainer({
        condition: this.props.isCurrentAsset,
        className:
          currentAssetClassName ||
          (this.props.customClassNames || {}).currentAsset,
      });
    }
    if (this.props.metadataClassesConditions) {
      this.props.metadataClassesConditions.forEach(condition => {
        this.addCssClassesToMetadataContainer(condition);
      });
    }
  };

  initiateScale = () => {
    if (this.svgParentNode.current && this.pinchZoomContainer.current) {
      const nonSvgChildrenHeight = Array.from(this.svgParentNode.current
        .childNodes as NodeListOf<HTMLElement>)
        .filter(node => !node.isEqualNode(this.pinchZoomContainer.current))
        .reduce((acc, node) => acc + node.clientHeight, 0);
      const svgNodeHeight =
        this.svgParentNode.current.clientHeight - nonSvgChildrenHeight;
      this.pinchZoomContainer.current.style.height = `${svgNodeHeight - 1}px`;
    }
  };

  initPinchToZoom = () => {
    if (this.pinchZoom.current) {
      this.pinchZoom.current.innerHTML = '';
      this.pinchZoom.current.appendChild(this.svg);
      this.pinchZoomInstance = new PinchZoom(this.pinchZoom.current, {
        animationDuration: 0,
        tapZoomFactor: 8,
        maxZoom: 30,
        minZoom: 1,
      });
    }
  };

  initAttributesForMetadataContainer = () => {
    const metadataArray = this.svg.querySelectorAll('metadata');
    Array.from(metadataArray).forEach((metadata: SVGMetadataElement) => {
      const metadataContainer = metadata.parentNode as HTMLElement;
      if (metadataContainer) {
        metadataContainer.classList.add('metadata-container');
        metadataContainer.setAttribute('data-test-id', 'metadata');
        if (!this.props.showOverlappedText) {
          const textNodes = metadataContainer.querySelectorAll('text');
          const className = 'overlapped-text';
          textNodes.forEach(textNode => {
            textNode.classList.remove(className);
            if (this.isNullStrokeWidth(textNode)) {
              textNode.classList.add(className);
            }
          });
        }
      }
    });
  };

  onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!this.pinchZoomInstance) {
      return;
    }
    this.dragging = true;
    this.pinchZoomInstance.stopAnimation();
    this.startMouse = {
      x: event.pageX,
      y: event.pageY,
    };
  };

  onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (this.dragging) {
      event.preventDefault();

      const currentMoveDistanceX = event.pageX - this.startMouse.x;
      const currentMoveDistanceY = event.pageY - this.startMouse.y;

      this.pinchZoomInstance.offset.x -=
        currentMoveDistanceX - this.prevMoveDistanceX;
      this.pinchZoomInstance.offset.y -=
        currentMoveDistanceY - this.prevMoveDistanceY;
      this.pinchZoomInstance.offset = this.pinchZoomInstance.sanitizeOffset(
        this.pinchZoomInstance.offset
      );
      this.pinchZoomInstance.update();

      this.prevMoveDistanceX = currentMoveDistanceX;
      this.prevMoveDistanceY = currentMoveDistanceY;
    }
  };

  onMouseUp = () => {
    if (this.inputWrapper.current) {
      this.inputWrapper.current.focus();
    }
    this.dragging = false;
    this.prevMoveDistanceX = 0;
    this.prevMoveDistanceY = 0;
  };

  // we need to remove and add back optimization as suggested here
  // https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
  // so all the items will be rendered not blurry
  onTouchStart = () => {
    if (this.pinchZoom.current) {
      // @ts-ignore 'willChange' is not a part of 'CSSStyleDeclaration'
      this.pinchZoom.current.style.willChange = 'transform';
    }
  };

  // tslint:disable-next-line no-identical-functions
  onTouchEnd = () => {
    if (this.pinchZoom.current) {
      // @ts-ignore 'willChange' is not a part of 'CSSStyleDeclaration'
      this.pinchZoom.current.style.willChange = 'auto';
    }
  };

  addCssClassesToMetadataContainer = ({
    condition,
    className,
  }: {
    condition: (metadataNode: Element) => boolean;
    className: string;
  }) => {
    const metadataArray = this.svg.querySelectorAll('metadata');
    Array.from(metadataArray).forEach((metadata: SVGMetadataElement) => {
      const metadataContainer = metadata.parentNode as HTMLElement;
      metadataContainer.classList.remove(className);
      if (condition(metadata)) {
        metadataContainer.classList.add(className);
      }
    });
  };

  addCssClassesToSvgText = ({
    condition,
    className,
  }: {
    condition: (metadataNode: Element) => boolean;
    className: string;
  }) => {
    if (this.svgParentNode.current) {
      const textNodes = this.svgParentNode.current.querySelectorAll(
        'svg > text, svg > g:not(.metadata-container) > text'
      );
      textNodes.forEach(textNode => {
        textNode.classList.remove(className);
        if (condition(textNode)) {
          textNode.classList.add(className);
        }
      });
    }
  };

  isNullStrokeWidth = (textNode: Element) =>
    textNode.getAttribute('stroke-width') === '0';

  handleItemClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const parentNode = target.parentNode as HTMLElement;
    if (parentNode && parentNode.classList.contains('metadata-container')) {
      this.handleCancelSearch();
      if (this.props.handleItemClick) {
        this.props.handleItemClick(parentNode);
      }
    }
    e.stopPropagation();
  };

  handleTrackpadZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      if (!this.pinchZoomInstance.container) {
        return;
      }
      this.animateZoom(
        e.deltaY < 0 ? wheelZoomLevel : -wheelZoomLevel,
        'trackpad',
        {
          x: e.clientX,
          y: e.clientY,
        }
      );
    }
  };

  animateZoom = (
    zoomProgress: number,
    source: string,
    zoomCenter?: ZoomCenter
  ) => {
    if (!this.pinchZoomInstance) {
      return;
    }
    const startZoomFactor = this.pinchZoomInstance.zoomFactor;
    const center = zoomCenter || {
      x: this.pinchZoomInstance.container.clientWidth / 2,
      y: this.pinchZoomInstance.container.clientHeight / 2,
    };
    const updateProgress = (progress: number) => {
      this.pinchZoomInstance.scaleTo(
        startZoomFactor + progress * zoomProgress,
        center
      );
    };
    this.pinchZoomInstance.animate(
      this.pinchZoomInstance.options.animationDuration,
      updateProgress,
      this.pinchZoomInstance.swing
    );
    if (this.props.handleAnimateZoom) {
      this.props.handleAnimateZoom({ zoomProgress, source, zoomCenter });
    }
  };

  zoomOnCurrentAsset = (currentAsset: Element | null) => {
    const isDesktop = this.state.width > 992;
    if (!currentAsset || !this.pinchZoomInstance.container) {
      return;
    }
    this.pinchZoomInstance.zoomFactor = isDesktop
      ? zoomLevel * 3
      : zoomLevel * 10;
    // Need to wait until zoom applies to get proper offsets
    setTimeout(() => {
      const currentAssetPosition = currentAsset.getBoundingClientRect();
      if (currentAssetPosition) {
        this.pinchZoomInstance.offset = {
          x:
            currentAssetPosition.left -
            this.pinchZoomInstance.container.clientWidth / 2 +
            this.pinchZoomInstance.offset.x,
          y:
            currentAssetPosition.top -
            this.pinchZoomInstance.container.clientHeight / 2 +
            this.pinchZoomInstance.offset.y,
        };
        // Zoom may create invalid position
        this.pinchZoomInstance.offset = this.pinchZoomInstance.sanitizeOffset(
          this.pinchZoomInstance.offset
        );
        this.pinchZoomInstance.update();
      }
    });
  };

  zoomIn = () => {
    this.animateZoom(zoomLevel, 'topbar');
  };

  zoomOut = () => {
    if (!this.pinchZoomInstance) {
      return;
    }
    let zoomFactor;
    const startZoomFactor = this.pinchZoomInstance.zoomFactor;
    if (startZoomFactor - zoomLevel > 1) {
      zoomFactor = startZoomFactor - zoomLevel;
    } else {
      zoomFactor = 1;
    }
    this.animateZoom(zoomFactor - startZoomFactor, 'topbar');
  };

  openSearch = () => {
    this.setState({ isSearchVisible: true });
  };

  handleCancelSearch = () => {
    this.setState({
      isSearchVisible: false,
    });
  };

  handleCloseModal = () => {
    if (this.props.handleCancel) {
      this.props.handleCancel();
    }
  };

  handleSearchFocus = () => {
    this.setState({ isSearchFocused: true });
  };

  handleSearchBlur = () => {
    this.setState({ isSearchFocused: false });
  };

  onContainerClick = () => {
    if (this.inputWrapper.current) {
      this.inputWrapper.current.focus();
    }
  };

  onContainerBlur = () => {
    this.setState({ handleKeyDown: false });
  };

  onContainerFocus = () => {
    this.setState({ handleKeyDown: true });
  };

  handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!this.state.handleKeyDown) {
      return;
    }

    // Overriding ctrl+F
    const FKeyCode = 70;
    if ((e.ctrlKey || e.metaKey) && e.keyCode === FKeyCode) {
      e.preventDefault();
      this.openSearch();
    }
  };
}

const SVGViewerContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

interface InternalThemedStyledProps {
  customClassNames: CustomClassNames;
}

const SvgNode = styled.div`
  cursor: move;
  overflow: auto;
  height: 100%;
  width: 100%;
  background: #ffffff;
  > svg {
    display: block;
  }
  ${(props: InternalThemedStyledProps) =>
    !props.customClassNames.searchResults &&
    // tslint:disable-next-line: no-nested-template-literals
    `
  .search-result {
    &.metadata-container {
      text {
        stroke: #c945db !important;
        fill: #c945db !important;
        font-weight: bold;
      }
    }
    &:not(.metadata-container) {
      stroke: #c945db !important;
      fill: #c945db !important;
      font-weight: bold;
    }
  }`}
  ${(props: InternalThemedStyledProps) =>
    !props.customClassNames.currentSearchResult &&
    // tslint:disable-next-line: no-nested-template-literals
    `
  .current-search-result {
    &.metadata-container {
      text {
        stroke: #3838ff !important;
        fill: #3838ff !important;
      }
    }
    &:not(.metadata-container) {
      stroke: #3838ff !important;
      fill: #3838ff !important;
    }
  }`}
  .metadata-container {
    cursor: pointer;
    > {
      text {
        transition: all 0.2s ease;
        stroke: #000000;
        fill: #000000;
        stroke-width: 0.1;
        text-decoration: underline;
      }
      text.overlapped-text {
        fill: none;
        stroke-width: 0;
      }
      path {
        transition: stroke 0.2s ease;
        pointer-events: bounding-box; /* increase hovering area */
      }
    }
    &:hover,
    &:focus > {
      text {
        stroke: #36a2c2;
        fill: #36a2c2;
      }
      text.overlapped-text {
        fill: none;
        stroke-width: 0;
      }
      path {
        stroke: #36a2c2;
      }
    }
    ${(props: InternalThemedStyledProps) =>
      !props.customClassNames.currentAsset &&
      // tslint:disable-next-line: no-nested-template-literals
      `
    &.current-asset {
      outline: auto 2px #36a2c2;
      cursor: default;
      > {
        text {
          stroke: #36a2c2;
          fill: #36a2c2;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        path {
          stroke: #36a2c2;
          transition: all 0.2s ease;
        }
      }
    }`}
  }
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  height: 65px;
  padding: 10px;
  border-radius: 4px 4px 0 0;
  background: #fff;
  color: rgba(0, 0, 0, 0.65);
  border-bottom: 1px solid #e8e8e8;

  @media (min-width: 992px) {
    padding: 5px 5px 5px 24px;
  }
`;

const OverflowText = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledHeaderTitle = styled.div`
  margin-right: 20px;
  font-size: 1em;
  font-weight: 600;
  width: 100%;
  overflow: hidden;
`;

const StyledHeaderDescription = styled(OverflowText)`
  font-size: 13px;
  font-weight: 400;
`;

const StyledHeaderButtonsContainer = styled.div`
  display: flex;
`;

const StyledFileName = styled(OverflowText)`
  font-size: 16px;
`;

const ModalButton = styled.button`
  display: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  @media (min-width: 992px) {
    display: inherit;
  }
`;

const CloseModalButton = styled(ModalButton)`
  width: 45px;
  margin-left: 10px;
  border-left: 1px solid #f5f5f5;
  padding-top: 10px;
  padding-bottom: 10px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const MobileModalClose = styled(ModalButton)`
  display: inherit;
  margin-right: 15px;

  @media (min-width: 992px) {
    display: none;
  }
`;

const ModalMobileFooter = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #ffffff;
  border-top: 1px solid #e8e8e8;
`;

const MobileSearchButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  outline: none;
`;
