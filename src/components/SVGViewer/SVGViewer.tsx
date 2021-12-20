// Copyright 2021 Cognite AS
import { CogniteClient } from '@cognite/sdk';
import { Icon } from 'antd';
import { PinchZoom } from './pinchzoom';
import React, { Component, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import * as CustomIcon from './Icons';
import DOMPurify from 'dompurify';

import {
  CustomClassNames,
  SvgViewerDocumentIdProps,
  SvgViewerFileProps,
  SvgViewerProps,
  ZoomCenter,
} from './interfaces';
import SVGViewerSearch from './SVGViewerSearch';
import { getDocumentDownloadLink } from './utils';

const defaultZoomLevel = 0.7;
const wheelZoomLevel = 0.15;
const defaultCurrentAssetClassName = 'current-asset';
const minDesktopWidth = 992;

interface SvgViewerState {
  isSearchVisible: boolean;
  isSearchFocused: boolean;
  isDesktop: boolean;
}

export class SVGViewer extends Component<SvgViewerProps, SvgViewerState> {
  static defaultProps = {
    maxZoom: 30,
    minZoom: 1,
  };
  static displayName = 'SVGViewer';
  static contextType = ClientSDKProxyContext;
  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;
  prevMoveDistanceX: number = 0;
  prevMoveDistanceY: number = 0;
  dragging: boolean = false;
  startMouse!: ZoomCenter;
  pinchZoomInstance!: PinchZoom;
  svg!: SVGSVGElement;
  pinchZoom: React.RefObject<HTMLDivElement>;
  pinchZoomContainer: React.RefObject<HTMLDivElement>;
  svgParentNode: React.RefObject<HTMLDivElement>;
  isOptimizationDisabled: boolean = false;
  constructor(props: SvgViewerProps) {
    super(props);
    this.state = {
      isSearchVisible: false,
      isSearchFocused: false,
      isDesktop: window.innerWidth > minDesktopWidth,
    };

    this.pinchZoom = React.createRef();
    this.pinchZoomContainer = React.createRef();
    this.svgParentNode = React.createRef();
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
    if (this.svgParentNode.current) {
      this.svgParentNode.current.addEventListener(
        'wheel',
        this.handleTrackpadZoom,
        { passive: false }
      );
    }
  }

  componentDidUpdate(prevProps: SvgViewerProps) {
    const { documentId: prevDocId } = prevProps as SvgViewerDocumentIdProps;
    const { documentId: currDocId } = this.props as SvgViewerDocumentIdProps;
    const { file: prevFile } = prevProps as SvgViewerFileProps;
    const { file: currFile } = this.props as SvgViewerFileProps;
    const { maxZoom: prevMax, minZoom: prevMin } = prevProps;
    const { maxZoom: currMax, minZoom: currMin } = this.props;

    if (
      (currDocId !== undefined && currDocId !== prevDocId) ||
      (currFile !== undefined && currFile !== prevFile) ||
      currMax !== prevMax ||
      currMin !== prevMin
    ) {
      this.presetSVG();
    }
  }

  componentWillUnmount() {
    if (this.svgParentNode.current) {
      this.svgParentNode.current.removeEventListener(
        'wheel',
        this.handleTrackpadZoom
      );
    }
    window.removeEventListener('resize', this.initiateScale);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render() {
    const {
      title,
      description,
      customClassNames = {},
      handleSearchChange,
      downloadablePdf = null,
    } = this.props;
    const { isDesktop } = this.state;
    const hasCloseButton = !!this.props.handleCancel;
    return (
      <SVGViewerContainer
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        onFocus={() => {
          if (this.pinchZoom.current) {
            this.pinchZoom.current.style.willChange = 'transform';
          }
        }}
        onBlur={() => {
          if (this.pinchZoom.current) {
            this.pinchZoom.current.style.willChange = 'auto';
          }
        }}
      >
        <SvgNode
          ref={this.svgParentNode}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          // disable tap to search functionality for Android
          // https://developers.google.com/web/updates/2015/10/tap-to-search
          tabIndex={-1}
          customClassNames={customClassNames}
          data-test-id="svg-viewer"
        >
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
                {downloadablePdf && (
                  <ModalButton
                    onClick={this.handleDownload}
                    data-test-id="download-button-svgviewer"
                  >
                    <CustomIcon.PDF />
                  </ModalButton>
                )}
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
          {/* todo(INFIELD-2720) make search focused on repeated ctrl+F or click on search button */}
          <SVGViewerSearch
            visible={this.state.isSearchVisible}
            svg={this.svg}
            openSearch={this.openSearch}
            onSearchResult={this.handleSearchResult}
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
          {/* move pinchZoomContainer if search is visible on mobile */}
          <div
            ref={this.pinchZoomContainer}
            style={
              !isDesktop && this.state.isSearchVisible
                ? { top: '65px', position: 'relative' }
                : {}
            }
          >
            <div ref={this.pinchZoom} />
          </div>
          {!isDesktop && !this.state.isSearchFocused ? (
            <ModalMobileFooter>
              <MobileSearchButton
                data-test-id="search-button-svgviewer"
                onClick={this.openSearch}
              >
                <CustomIcon.FindInPage />
              </MobileSearchButton>
              {downloadablePdf && (
                <MobileSearchButton
                  onClick={this.handleDownload}
                  data-test-id="download-button-svgviewer"
                >
                  <CustomIcon.PDF />
                </MobileSearchButton>
              )}
            </ModalMobileFooter>
          ) : null}
        </SvgNode>
      </SVGViewerContainer>
    );
  }

  updateWindowDimensions = () => {
    this.setState({
      isDesktop: window.innerWidth > minDesktopWidth,
    });
  };

  getCurrentAssetClassName = () => {
    return (
      (this.props.customClassNames || {}).currentAsset ||
      defaultCurrentAssetClassName
    );
  };

  presetSVG = async () => {
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
        this.props.handleDocumentLoadError(e as Error);
      }
    }
    if (svgString) {
      const parser = new DOMParser();
      // An SVG can contain Javascript, so run it through DOMPurify before
      // embedding it in the DOM.
      // Replace for svgs that has PNG inside
      svgString = DOMPurify.sanitize(svgString.replace(/ns1:href/g, 'href'), {
        ADD_TAGS: ['entities', 'entity', 'id'],
      });
      const svgFromUrl = parser.parseFromString(svgString, 'image/svg+xml');
      // if during parsing there was an error, svg will be rendered
      // inside html tag until the line where an error occured,
      // so we need to cover that case and show only svg
      this.svg = svgFromUrl.getElementsByTagName('svg')[0];
      if (this.svg) {
        this.initiateScale();
        this.initPinchToZoom();
        this.initAttributesForMetadataContainer();
        this.shouldDisableOptimization();
        this.setCustomClasses();
        this.svg.addEventListener('click', this.handleItemClick);
        const currentAssetElement = document.querySelector(
          `.${this.getCurrentAssetClassName()}`
        )!;
        this.zoomOnElement(currentAssetElement, this.props.initialZoom);
      }
    }
  };

  setCustomClasses = () => {
    const classesAndConditions = [
      ...(this.props.metadataClassesConditions || []),
    ];
    if (this.props.isCurrentAsset) {
      classesAndConditions.push({
        condition: this.props.isCurrentAsset,
        className: this.getCurrentAssetClassName(),
      });
    }

    this.addBulkClassesToMetadataContainer(classesAndConditions);
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
        maxZoom: this.props.maxZoom,
        minZoom: this.props.minZoom,
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

  shouldDisableOptimization = () => {
    // Because willChange optimization has a calculation cost
    // we don't want to apply it for a bigger embedded into svg <image />
    // tags since it slows down the performance instead of providing
    // a boost. Images are already heavily optimized by browsers
    // so we don't need to care much about additional optimizations.
    const metadataArray = this.svg.querySelectorAll('image');
    this.isOptimizationDisabled = metadataArray.length > 0;
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
    if (this.dragging && this.pinchZoomInstance) {
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
    this.dragging = false;
    this.prevMoveDistanceX = 0;
    this.prevMoveDistanceY = 0;
  };

  addCssClassesToMetadataContainer = ({
    condition,
    className,
  }: {
    condition: (metadataNode: Element) => boolean;
    className: string;
  }) => {
    const metadataArray = this.svg.querySelectorAll('.metadata-container');
    Array.from(metadataArray).forEach((metadataContainer: Element) => {
      metadataContainer.classList.remove(className);
      Array.from(metadataContainer.querySelectorAll('metadata')).forEach(
        (metadata: SVGMetadataElement) => {
          if (condition(metadata)) {
            metadataContainer.classList.add(className);
          }
        }
      );
    });
  };

  addBulkClassesToMetadataContainer = (
    metadataClassesAndConditions: {
      condition: (metadataNode: Element) => boolean;
      className: string;
    }[]
  ) => {
    if (!metadataClassesAndConditions.length) {
      return;
    }
    const metadataContainers = this.svg.querySelectorAll('.metadata-container');
    metadataContainers.forEach(metaContainer => {
      // reset classes in case this method is being called more than once for the same document
      // avoid resetting all the classes, as they may contain currentAsset class that affects zoom
      metadataClassesAndConditions.forEach(({ className }) => {
        metaContainer.classList.remove(className);
      });

      const metadataElements = Array.from(
        metaContainer.querySelectorAll('metadata')
      );

      metadataClassesAndConditions
        .filter(({ condition }) =>
          // check if any metadataElement satisfies condition,
          // one is enough to put className on the metadata container
          metadataElements.some(condition)
        )
        .forEach(({ className }) => metaContainer.classList.add(className));
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

  handleTrackpadZoom = (e: WheelEvent) => {
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

  // used to overcome the issue when an element is in the DOM
  // but its position changes over time, so you can't use it until it's stable
  getStableBoundingClientRect = (
    el: Element,
    maxAttempts = 10
  ): Promise<DOMRect | null> => {
    return new Promise(resolve => {
      if (!el) {
        resolve(null);
      }
      const isStabilized = (element: Element) => {
        const rect1 = element.getBoundingClientRect();
        setTimeout(() => {
          maxAttempts--;
          const rect2 = element.getBoundingClientRect();
          if (
            (rect1.left === rect2.left && rect1.top === rect2.top) ||
            maxAttempts === 0
          ) {
            resolve(rect2);
          } else {
            isStabilized(element);
          }
        }, 100);
      };

      isStabilized(el);
    });
  };

  handleSearchResult = (foundElement: Element | null) => {
    this.zoomOnElement(
      foundElement,
      this.props.searchZoom || this.props.initialZoom
    );
  };

  /**
   * @param element - any annotation element on SVG, typically asset or document
   * @param zoomLevel
   */
  zoomOnElement = (element: Element | null, zoomLevel?: number) => {
    if (!element || !this.pinchZoomInstance) {
      return;
    }
    const defaultZoom = this.state.isDesktop
      ? defaultZoomLevel * 5
      : defaultZoomLevel * 10;
    this.pinchZoomInstance.zoomFactor = zoomLevel || defaultZoom;

    const zoom = (elementPosition: DOMRect | null) => {
      if (elementPosition) {
        this.pinchZoomInstance.offset = {
          x:
            elementPosition.left -
            this.pinchZoomInstance.container.clientWidth / 2 +
            this.pinchZoomInstance.offset.x,
          y:
            elementPosition.top -
            this.pinchZoomInstance.container.clientHeight / 2 +
            this.pinchZoomInstance.offset.y,
        };

        // Zoom may create invalid position
        this.pinchZoomInstance.offset = this.pinchZoomInstance.sanitizeOffset(
          this.pinchZoomInstance.offset
        );
        this.pinchZoomInstance.update();
      }
    };

    // try to zoom almost immediately
    // but adjust later in case if asset DOM element position has changed
    setTimeout(async () => {
      const initialRect = element.getBoundingClientRect();
      zoom(initialRect);
      const stableRect = await this.getStableBoundingClientRect(element);
      if (
        stableRect &&
        stableRect.left !== initialRect.left &&
        stableRect.top !== initialRect.top
      ) {
        zoom(stableRect);
      }
    });
  };

  /** @deprecated as class component methods are kind of part of public API,
   * not removing it right away. Remove it in the next major */
  zoomOnCurrentAsset = (currentAsset: Element | null) => {
    console.warn(
      'SVGViewer: zoomOnCurrentAsset is deprecated, use zoomOnElement(asset: Element | null, zoomLevel?: number)'
    );
    this.zoomOnElement(currentAsset, this.props.initialZoom);
  };

  zoomIn = () => {
    this.animateZoom(defaultZoomLevel, 'topbar');
  };

  zoomOut = () => {
    if (!this.pinchZoomInstance) {
      return;
    }
    let zoomFactor;
    const startZoomFactor = this.pinchZoomInstance.zoomFactor;
    if (startZoomFactor - defaultZoomLevel > 1) {
      zoomFactor = startZoomFactor - defaultZoomLevel;
    } else {
      zoomFactor = 1;
    }
    this.animateZoom(zoomFactor - startZoomFactor, 'topbar');
  };

  openSearch = () => {
    this.setState({ isSearchVisible: true });
  };

  handleDownload = async () => {
    window.open(this.props.downloadablePdf, '_blank');
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

  handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
  contain: strict;
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
      `
    &.${defaultCurrentAssetClassName} {
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
  color: black;
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
    align-items: center;
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
