import { DataProviderSeries } from '@cognite/griff-react';
import moment from 'moment';
import numeral from 'numeral';
import React from 'react';
import styled from 'styled-components';
import { ChartRulerConfig, ChartRulerPoint } from '../interfaces';

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  z-index: 100;
`;

const Overview = styled.div`
  position: absolute;
  top: 0;
  width: 140px;
  background: #fff;
  padding: 8px 16px 10px;
  pointer-events: none;
  opacity: 0.9;
  border-radius: 4px;
  border: 1px solid #888888;
  box-sizing: border-box;
`;

const DateContainer = styled.div`
  position: absolute;
  top: 0;
  width: 220px;
  color: black;
  background: #fff;
  padding: 8px 16px 10px;
  pointer-events: none;
  opacity: 0.9;
  border-radius: 4px;
  border: 1px solid #888888;
  box-sizing: border-box;
`;

const Tag = styled.div`
  color: black;
  &:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin: 0 8px 0 2px;
    background: ${props => (props.color ? props.color : '#6c6c6c')};
  }
`;

const formattedDate = (timestamp: number) =>
  moment(timestamp).format('MMM D, YYYY HH:mm:ss');

const containerMargin = 5; // margin for overview container and date container

interface CursorOverviewStyles {
  container?: React.CSSProperties;
}
interface CursorOverviewState {
  overviewContainer: HTMLElement | null;
}
interface CursorOverviewProps {
  wrapperRef: HTMLElement | null;
  series: DataProviderSeries[];
  hiddenSeries: { [id: number]: boolean };
  ruler: ChartRulerConfig;
  rulerPoints: { [key: string]: ChartRulerPoint };
  styles?: CursorOverviewStyles;
  xAxisHeight: number;
  yAxisPlacement: 'RIGHT' | 'LEFT' | 'BOTH';
}

export class CursorOverview extends React.Component<
  CursorOverviewProps,
  CursorOverviewState
> {
  overviewContainer: HTMLElement | null = null;
  dateContainer: HTMLElement | null = null;

  constructor(props: CursorOverviewProps) {
    super(props);

    this.state = {
      overviewContainer: null,
    };
  }

  componentDidMount = () => {
    window.addEventListener('mousemove', this.handleMouseMove);
  };

  componentWillUnmount = () => {
    window.removeEventListener('mousemove', this.handleMouseMove);
  };

  getLeftSideYAxisWidth = (linesContainer: Element): number => {
    const { wrapperRef, yAxisPlacement } = this.props;
    if (!wrapperRef) {
      return 0;
    }
    const yAxisTotalWidth =
      wrapperRef.getBoundingClientRect().width -
      linesContainer.getBoundingClientRect().width; // difference between wrapper and line chart area width

    return yAxisPlacement === 'LEFT'
      ? yAxisTotalWidth
      : yAxisPlacement === 'BOTH'
      ? yAxisTotalWidth / 2
      : 0;
  };

  hasNoSpaceInLeft = (offsetX: number, containerWidth: number): boolean => {
    return offsetX < containerWidth + containerMargin;
  }; // return true if no space for container in left.

  getPositionInRight = (offsetX: number): number => {
    return offsetX + containerMargin;
  };

  getPositionInLeft = (offsetX: number, containerWidth: number): number => {
    return offsetX - containerWidth - containerMargin;
  };

  getValidXposition = (
    offsetX: number,
    containerWidth: number,
    yAxisLeftWidth: number
  ): number => {
    return (
      (this.hasNoSpaceInLeft(offsetX, containerWidth)
        ? this.getPositionInRight(offsetX)
        : this.getPositionInLeft(offsetX, containerWidth)) + yAxisLeftWidth
    );
  };

  getDateContainerYPossition = (linesContainerHeight: number): number => {
    const { xAxisHeight } = this.props;
    const dcHeight = this.dateContainer
      ? this.dateContainer.getBoundingClientRect().height
      : 0;
    return (
      linesContainerHeight - dcHeight - (xAxisHeight ? containerMargin : 0)
    );
  };

  getOverviewContainerYPossition = (
    offsetY: number,
    linesContainerHeight: number,
    ocHeight: number
  ): number => {
    const bottomBoundry =
      this.getDateContainerYPossition(linesContainerHeight) -
      ocHeight -
      containerMargin;
    const topBoundry = 0;
    const currentYPosition = offsetY - ocHeight / 2;
    return currentYPosition > bottomBoundry // if the cursor goes below the lowest margin
      ? bottomBoundry
      : currentYPosition < topBoundry // if the cursor goes beyond the top margin
      ? topBoundry
      : currentYPosition;
  };

  handleMouseMove = (e: MouseEvent) => {
    const { wrapperRef } = this.props;
    if (
      !wrapperRef ||
      wrapperRef.getElementsByClassName('lines-container').length === 0
    ) {
      return;
    }

    const linesContainer = wrapperRef.getElementsByClassName(
      'lines-container'
    )[0];
    const linesContainerHeight = linesContainer.getBoundingClientRect().height;

    // get left side y axis width in oder to set the position for containers comparatively
    const yAxisLeftWidth = this.getLeftSideYAxisWidth(linesContainer);

    // set the dynamic x and y position for date container on cursor move
    if (this.dateContainer) {
      const dcWidth = this.dateContainer.getBoundingClientRect().width;
      this.dateContainer.setAttribute(
        'style',
        `transform: translate(${this.getValidXposition(
          e.offsetX,
          dcWidth,
          yAxisLeftWidth
        )}px,
        ${this.getDateContainerYPossition(linesContainerHeight)}px)`
      );
    }

    // set the dynamic x and y position for overview container on cursor move
    if (this.overviewContainer) {
      const ocHeight = this.overviewContainer.getBoundingClientRect().height;
      const ocWidth = this.overviewContainer.getBoundingClientRect().width;
      this.overviewContainer.setAttribute(
        'style',
        `transform: translate(${this.getValidXposition(
          e.offsetX,
          ocWidth,
          yAxisLeftWidth
        )}px,
        ${this.getOverviewContainerYPossition(
          e.offsetY,
          linesContainerHeight,
          ocHeight
        )}px)`
      );
    }
  };

  render() {
    const {
      series,
      hiddenSeries,
      rulerPoints,
      ruler: { timeLabel, yLabel },
    } = this.props;
    if (
      !series ||
      !series.length ||
      !Object.keys(rulerPoints) ||
      !Object.keys(rulerPoints).length
    ) {
      return null;
    }

    const newestTimestamp = Object.keys(rulerPoints).reduce((acc, id) => {
      const rulerPoint: ChartRulerPoint = rulerPoints[id];
      return Math.max(rulerPoint.timestamp, acc);
    }, 0);

    const timeLabelFormatted = timeLabel
      ? timeLabel({
          id: 0,
          name: '',
          value: 0,
          color: '#ccddff',
          timestamp: newestTimestamp,
          x: 0,
          y: 0,
        })
      : formattedDate(newestTimestamp);

    const yLabelFormatter: (point: ChartRulerPoint) => string = yLabel
      ? yLabel
      : (point: ChartRulerPoint) => {
          return numeral(point.value).format('0[.]0[00] a');
        };

    const renderTag = ({ id, color }: { id: number; color?: string }) =>
      rulerPoints[id] &&
      !hiddenSeries[id] && (
        <Tag color={color} key={id}>
          {yLabelFormatter(rulerPoints[id])}
        </Tag>
      );

    return (
      <Container>
        <Overview ref={ref => (this.overviewContainer = ref)}>
          {series && series.map(renderTag)}
        </Overview>
        <DateContainer ref={ref => (this.dateContainer = ref)}>
          {timeLabelFormatted}
        </DateContainer>
      </Container>
    );
  }
}
