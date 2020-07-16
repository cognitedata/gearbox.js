import moment from 'moment';
import numeral from 'numeral';
import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TimeseriesChartRuler, TimeseriesChartRulerPoint } from '../interfaces';

const defaultTimeFormatter = (timestamp: number): string =>
  moment(timestamp).format('MMM D, YYYY HH:mm:ss');

const defaultValueFormatter = (value: number): string =>
  numeral(value).format('0[.]0[00] a');

interface CursorOverviewStyles {
  overview?: React.CSSProperties;
  date?: React.CSSProperties;
}
interface CursorOverviewProps {
  wrapperEl: HTMLDivElement | null;
  ruler: TimeseriesChartRuler;
  points: TimeseriesChartRulerPoint[];
  styles?: CursorOverviewStyles;
}

const onMouseMove = (
  event: MouseEvent,
  wrapperEl: HTMLDivElement,
  overviewEl: HTMLDivElement,
  dateEl: HTMLDivElement
): void => {
  if (!wrapperEl) {
    return;
  }

  if (overviewEl) {
    overviewEl.setAttribute(
      'style',
      `transform: translate(${event.offsetX}px,
        ${event.offsetY -
          overviewEl.getBoundingClientRect().height /
            2}px); visibility: visible;`
    );
  }

  if (dateEl) {
    const lineChartRect = wrapperEl.getBoundingClientRect();
    dateEl.setAttribute(
      'style',
      `transform: translate(${event.offsetX}px,
        ${lineChartRect.height -
          dateEl.clientHeight -
          55}px); visibility: visible;`
    );
  }
};

const onMouseOut = (
  wrapperEl: HTMLDivElement,
  overviewEl: HTMLDivElement,
  dateEl: HTMLDivElement
) => {
  if (!wrapperEl) {
    return;
  }

  if (overviewEl) {
    overviewEl.setAttribute('style', `visibility: hidden;`);
  }

  if (dateEl) {
    dateEl.setAttribute('style', `visibility: hidden;`);
  }
};

export const CursorOverview: React.FC<CursorOverviewProps> = ({
  wrapperEl,
  ruler: { visible, timeFormatter, valueFormatter },
  points,
}: CursorOverviewProps) => {
  if (!visible || !points.length) {
    return null;
  }

  const overviewContainer = useRef<HTMLDivElement>(null);
  const dateContainer = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(event => {
    const { current: overviewEl } = overviewContainer;
    const { current: dateEl } = dateContainer;

    if (!(wrapperEl && overviewEl && dateEl)) {
      return;
    }

    onMouseMove(event, wrapperEl, overviewEl, dateEl);
  }, []);

  const handleMouseOut = useCallback(() => {
    const { current: overviewEl } = overviewContainer;
    const { current: dateEl } = dateContainer;

    if (!(wrapperEl && overviewEl && dateEl)) {
      return;
    }

    onMouseOut(wrapperEl, overviewEl, dateEl);
  }, []);

  const timeLabelFormatter = useCallback(
    (timestamp: number): string =>
      (timeFormatter || defaultTimeFormatter)(timestamp),
    [timeFormatter]
  );

  const valueLabelFormatter = useCallback(
    (value: number) => (valueFormatter || defaultValueFormatter)(value),
    [valueFormatter]
  );

  const renderPointTag = useCallback(
    ({ id, color, value }: TimeseriesChartRulerPoint) => (
      <Tag color={color} key={id}>
        {valueLabelFormatter(value)}
      </Tag>
    ),
    [valueLabelFormatter]
  );

  useEffect(() => {
    wrapperEl!.addEventListener('mousemove', handleMouseMove);
    wrapperEl!.addEventListener('mouseout', handleMouseOut);
    return () => {
      wrapperEl!.removeEventListener('mousemove', handleMouseMove);
      wrapperEl!.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseMove]);

  return (
    <Container>
      <Overview ref={overviewContainer}>{points.map(renderPointTag)}</Overview>
      <DateContainer ref={dateContainer}>
        {timeLabelFormatter(points[0].timestamp)}
      </DateContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  z-index: 100;
`;
const Overview = styled.div`
  position: absolute;
  top: 0;
  margin-left: -150px;
  width: 140px;
  background: #fff;
  padding: 8px 16px 10px;
  pointer-events: none;
  opacity: 0.9;
  border-radius: 4px;
  border: 1px solid #888888;
  box-sizing: border-box;
  visibility: hidden;
`;
const DateContainer = styled.div`
  position: absolute;
  top: 0;
  margin-left: -230px;
  width: 220px;
  color: black;
  background: #fff;
  padding: 8px 16px 10px;
  pointer-events: none;
  opacity: 0.9;
  border-radius: 4px;
  border: 1px solid #888888;
  box-sizing: border-box;
  visibility: hidden;
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
