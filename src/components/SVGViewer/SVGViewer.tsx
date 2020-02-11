import { CogniteClient } from '@cognite/sdk';
import { Icon } from 'antd';
import PinchZoom from 'pinch-zoom-js';
import React, { Component, KeyboardEvent, RefObject } from 'react';
import {
  ALIGN_COVER,
  fitSelection,
  fitToViewer,
  INITIAL_VALUE,
  ReactSVGPanZoom,
} from 'react-svg-pan-zoom';
import { AutoSizer } from 'react-virtualized';
import styled from 'styled-components';
import * as transformationMatrix from 'transformation-matrix';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import * as CustomIcon from './Icons';
import {
  CustomClassNames,
  PinchZoomInterface,
  SvgViewerDocumentIdProps,
  SvgViewerFileProps,
  SvgViewerProps,
  ZoomCenter,
} from './interfaces';
import SVGViewerSearch from './SVGViewerSearch';
import { getDocumentDownloadLink } from './utils';

const zoomLevel = 0.7;
const wheelZoomLevel = 0.15;
const currentAssetClassName = 'current-asset';
const minDesktopWidth = 992;

interface SvgViewerState {
  isSearchVisible: boolean;
  isSearchFocused: boolean;
  width: number;
  handleKeyDown: boolean;
  svg?: SVGSVGElement;
  value: any;
}

export class SVGViewer extends Component<SvgViewerProps, SvgViewerState> {
  static displayName = 'SVGViewer';
  static contextType = ClientSDKProxyContext;
  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;
  prevMoveDistanceX: number = 0;
  prevMoveDistanceY: number = 0;
  dragging: boolean;
  initialLoad: boolean;
  startMouse: boolean;
  pinchZoomInstance!: PinchZoomInterface;
  inputWrapper: RefObject<HTMLInputElement>;
  svg!: SVGSVGElement;
  viewer: React.RefObject<ReactSVGPanZoom>;
  svgNodeRef: React.RefObject<SVGGElement>;
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
      value: INITIAL_VALUE,
    };
    this.dragging = false;
    this.startMouse = false;
    this.initialLoad = true;

    this.viewer = React.createRef();
    this.svgNodeRef = React.createRef();
    this.pinchZoom = React.createRef();
    this.pinchZoomContainer = React.createRef();
    this.svgParentNode = React.createRef();
    this.inputWrapper = React.createRef();
  }

  componentDidMount() {
    this.client = this.context(SVGViewer.displayName || '')!;
    if (!this.client) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
    this.presetSVG();
    window.addEventListener('resize', this.initiateScale);
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate(prevProps: SvgViewerProps, prevState: SvgViewerState) {
    const { documentId: prevDocId } = prevProps as SvgViewerDocumentIdProps;
    const { documentId: curDocId } = this.props as SvgViewerDocumentIdProps;
    const { file: prevFile } = prevProps as SvgViewerFileProps;
    const { file: currFile } = this.props as SvgViewerFileProps;

    if (this.svg) {
      this.setCustomClasses();
    }

    if (
      this.state.svg !== prevState.svg &&
      this.state.svg &&
      this.viewer.current
    ) {
      this.zoomOnCurrentAsset();
    }

    if (
      (curDocId !== undefined && curDocId !== prevDocId) ||
      (currFile !== undefined && currFile !== prevFile)
    ) {
      this.presetSVG();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.initiateScale);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  changeValue = nextValue => {
    this.setState({ value: nextValue });
  };

  render() {
    const {
      title,
      description,
      customClassNames = {},
      handleSearchChange,
    } = this.props;
    const isDesktop = this.state.width > minDesktopWidth;
    const hasCloseButton = !!this.props.handleCancel;

    return (
      <>
        <SVGViewerContainer>
          <AutoSizer>
            {({ width, height }) =>
              width === 0 || height === 0 ? null : (
                <ReactSVGPanZoom
                  width={width}
                  height={height}
                  ref={this.viewer}
                  tool="pan"
                  value={this.state.value}
                  onChangeValue={value => this.changeValue(value)}
                >
                  {this.state.svg ? (
                    <svg
                      width={this.state.svg.width.baseVal.valueAsString}
                      height={this.state.svg.height.baseVal.valueAsString}
                    >
                      <SvgNode
                        ref={this.svgNodeRef}
                        customClassNames={customClassNames}
                        tabIndex={-1}
                        onTouchStart={this.onMouseDown}
                        onTouchMove={this.onMouseMove}
                        onTouchEnd={this.onMouseUp}
                        onMouseDown={this.onMouseDown}
                        onMouseMove={this.onMouseMove}
                        onMouseUp={this.onMouseUp}
                        dangerouslySetInnerHTML={{
                          __html: this.state.svg.innerHTML,
                        }}
                        style={{ position: 'relative' }}
                      />
                    </svg>
                  ) : (
                    <svg width={617} height={316}>
                      <g fillOpacity=".5" strokeWidth="4">
                        <rect
                          x="400"
                          y="40"
                          width="100"
                          height="200"
                          fill="#4286f4"
                          stroke="#f4f142"
                        />
                        <circle
                          cx="108"
                          cy="108.5"
                          r="100"
                          fill="#0ff"
                          stroke="#0ff"
                        />
                        <circle
                          cx="180"
                          cy="209.5"
                          r="100"
                          fill="#ff0"
                          stroke="#ff0"
                        />
                        <circle
                          cx="220"
                          cy="109.5"
                          r="100"
                          fill="#f0f"
                          stroke="#f0f"
                        />
                      </g>
                    </svg>
                  )}
                </ReactSVGPanZoom>
              )
            }
          </AutoSizer>
          {/* show header if it's desktop or search is hidden for mobiles */}
          {(isDesktop || !this.state.isSearchVisible) && (
            <StyledHeaderContainer>
              {hasCloseButton && (
                <MobileModalClose
                  data-test-id="close-svgviewer-btn"
                  onClick={this.handleCloseModal}
                >
                  <Icon type="arrow-left" />
                </MobileModalClose>
              )}
              <StyledHeaderTitle>
                {title && <StyledFileName>{title}</StyledFileName>}
                {description && (
                  <StyledHeaderDescription>
                    {description}
                  </StyledHeaderDescription>
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
                {hasCloseButton && (
                  <CloseModalButton
                    onClick={this.handleCloseModal}
                    data-test-id="close-svgviewer-btn"
                  >
                    <CustomIcon.Close />
                  </CloseModalButton>
                )}
              </StyledHeaderButtonsContainer>
            </StyledHeaderContainer>
          )}
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
            handleSearchChange={handleSearchChange}
          />
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
        </SVGViewerContainer>
      </>
    );
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
    });
  };

  presetSVG = async () => {
    const { customClassNames } = this.props;
    let svgString;
    try {
      const { documentId } = this.props as SvgViewerDocumentIdProps;
      const { file } = this.props as SvgViewerFileProps;
      if (file) {
        svgString = file;
      } else if (documentId) {
        svgString = await getDocumentDownloadLink(this.client, documentId);
      }
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
        // this.zoomOnCurrentAsset(
        //   this.svg.querySelectorAll(
        //     `.${currentAssetClassName || (customClassNames || {}).currentAsset}`
        //   )
        // );
        this.setState({ svg: this.svg });
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
        setOffsetsOnce: true,
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

  onMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    this.startMouse = true;
  };

  onMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }
    if (this.startMouse) {
      this.dragging = true;
    }
  };

  onMouseUp = (event: React.MouseEvent | React.TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }
    if (!this.dragging) {
      this.handleItemClick(event);
    }
    this.dragging = false;
    this.startMouse = false;
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

  handleItemClick = (e: React.MouseEvent | React.TouchEvent) => {
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
      if (!this.pinchZoomInstance) {
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

  zoomOnCurrentAsset = () => {
    const currentNodes = Array.prototype.slice.call(
      document.querySelectorAll(
        `.${currentAssetClassName ||
          (this.props.customClassNames || {}).currentAsset}`
      )
    );
    if (!currentNodes || currentNodes.length === 0) {
      this.setState({
        value: fitToViewer(this.state.value, ALIGN_COVER, ALIGN_COVER),
      });
      return;
    } 
    const currentAssets = currentNodes.slice(0, currentNodes.length / 2);
    setTimeout(() => {
      const initialAssetPosition = currentAssets[0].getBBox();
      let top = initialAssetPosition.y;
      let left = initialAssetPosition.x;
      let right = initialAssetPosition.x + initialAssetPosition.width;
      let bottom = initialAssetPosition.y + initialAssetPosition.height;
      currentAssets.forEach(currentAsset => {
        console.log(currentAsset.getBBox());
        const currentAssetPosition = currentAsset.getBBox();
        top = Math.min(top, currentAssetPosition.y);
        left = Math.min(left, currentAssetPosition.x);
        bottom = Math.max(
          bottom,
          currentAssetPosition.y + currentAssetPosition.height
        );
        right = Math.max(
          right,
          currentAssetPosition.x + currentAssetPosition.width
        );
      });

      console.log(left, top, right - left, bottom - top);
      if (this.viewer && this.viewer.current) {
        if (
          this.svgNodeRef.current &&
          this.svgNodeRef.current.querySelector('g > g')
        ) {
          const attribute = (this.svgNodeRef.current.querySelector(
            'g > g'
          ) as SVGGElement).attributes.getNamedItem('transform');
          if (attribute) {
            const matrixes = transformationMatrix.fromTransformAttribute(
              attribute.value
            );
            const ctm = transformationMatrix.compose(
              transformationMatrix.fromDefinition(matrixes)
            );
            console.log(this.svgNodeRef.current, ctm);
            let point = { x: left, y: top };
            point.x = left;
            point.y = top;
            point = transformationMatrix.applyToPoint(ctm, point) as {
              x: number;
              y: number;
            };
            left = point.x;
            top = point.y;

            point.x = right;
            point.y = bottom;
            point = transformationMatrix.applyToPoint(ctm, point) as {
              x: number;
              y: number;
            };
            right = point.x;
            bottom = point.y;
          }
        }
        console.log(left, top, right - left, bottom - top);
        this.setState({
          value: fitSelection(
            this.state.value,
            left,
            top,
            right - left,
            bottom - top
          ),
        });
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
    const isDesktop = this.state.width > minDesktopWidth;
    if (isDesktop && this.inputWrapper.current) {
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

const SvgNode = styled.g`
  cursor: move;
  overflow: auto;
  height: 100%;
  width: 100%;
  background: #ffffff;

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
  z-index: 1000;

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
  position: absolute;
  bottom: 0;
  left: 0;
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
