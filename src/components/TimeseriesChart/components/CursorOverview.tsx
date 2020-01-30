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

const containerMargin = 5;

interface CursorOverviewStyles {
  container?: React.CSSProperties;
}
interface CursorOverviewState {
  overviewContainer: HTMLElement | null;
}
interface CursorOverviewProps {
  wrapperRef: HTMLElement | null;
  series: any;
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

  handleMouseMove = (e: MouseEvent) => {
    const { wrapperRef, xAxisHeight, yAxisPlacement } = this.props;
    if (!wrapperRef || wrapperRef.getElementsByClassName("lines-container").length == 0) {
      return;
    }

    const linesContainer = wrapperRef.getElementsByClassName("lines-container")[0];
    const linesContainerHeight = linesContainer.getBoundingClientRect().height;
    const yAxisWidth = linesContainer.getBoundingClientRect().width - wrapperRef.getBoundingClientRect().width;
    const yAxisShift = yAxisPlacement == 'LEFT' ? yAxisWidth : (yAxisPlacement == 'BOTH' ? (yAxisWidth / 2) : 0);

    let dcHeight = 0;

    if (this.dateContainer) {
      dcHeight = this.dateContainer.getBoundingClientRect().height;
      const dcWidth = this.dateContainer.getBoundingClientRect().width;
      const dcXPosition =
        (e.offsetX < dcWidth
          ? e.offsetX + containerMargin
          : e.offsetX - dcWidth - containerMargin) + yAxisShift;
          
      this.dateContainer.setAttribute(
        'style',
        `transform: translate(${dcXPosition}px,
        ${linesContainerHeight - dcHeight - (xAxisHeight ? containerMargin : 0)}px)`
      );
    }

    if (this.overviewContainer) {
      const ocHeight = this.overviewContainer.getBoundingClientRect().height;
      const ocWidth = this.overviewContainer.getBoundingClientRect().width;
      const ocMinYPosition =
      linesContainerHeight -
        (dcHeight +
          ocHeight +
          (xAxisHeight ? containerMargin : 0) +
          (dcHeight ? containerMargin : 0));
      const ocYPosition = e.offsetY - ocHeight / 2;
      const ocXPosition =
        (e.offsetX < ocWidth
          ? e.offsetX + containerMargin
          : e.offsetX - ocWidth - containerMargin) + yAxisShift;
      this.overviewContainer.setAttribute(
        'style',
        `transform: translate(${ocXPosition}px,
        ${
          ocYPosition > ocMinYPosition
            ? ocMinYPosition
            : ocYPosition >= 0
            ? ocYPosition
            : 0
        }px)`
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

    const renderTag = ({ id, color }: { id: number; color: string }) =>
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
