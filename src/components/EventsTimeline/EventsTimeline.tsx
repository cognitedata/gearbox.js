// Copyright 2020 Cognite AS
import { Dictionary, groupBy } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import { ChartLayout } from './components';
import { CogniteEventForTimeline, EventsTimelineProps } from './interfaces';

const toTimelinesDefault = (_: CogniteEventForTimeline) => '#000';
const minimalWidth = 100;

export const EventsTimeline = ({
  events,
  start,
  end,
  ruler,
  zoom,
  toTimelines,
  timelineSize: { height: tlHeight, bottom: tlBottom } = {
    height: 10,
    bottom: 10,
  },
  dateFormatter,
}: EventsTimelineProps) => {
  const context = useCogniteContext(EventsTimeline);

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [domain, setDomain] = useState<[number, number]>([start, end]);

  const [timelines, setTimelines] = useState<
    Dictionary<CogniteEventForTimeline[]>
  >({});

  const handleResize = () => {
    if (!wrapperRef.current) {
      return;
    }

    const { width: currentWidth } = wrapperRef.current.getBoundingClientRect();

    setWidth(currentWidth || minimalWidth);
  };

  const retrieveEvents = async (): Promise<CogniteEventForTimeline[]> => {
    const ids = events.map(({ id }) => ({ id }));
    const sdkEvents = await context!.events.retrieve(ids);

    return sdkEvents.map((e, i) => {
      const { view, type } = events[i];

      return { ...e, appearance: { view, type } };
    });
  };

  const onEventsPropChanges = async () => {
    const timelineEvents = await retrieveEvents();
    const groupTimelines: Dictionary<CogniteEventForTimeline[]> = groupBy<
      CogniteEventForTimeline
    >(timelineEvents, toTimelines || toTimelinesDefault);
    const componentHeight =
      Object.keys(groupTimelines).length * (tlHeight + tlBottom);

    setTimelines(groupTimelines);
    setHeight(componentHeight);
  };

  const onZoomCallback = (newDomain: [number, number]) => {
    setDomain(newDomain);

    if (zoom!.onZoom) {
      zoom!.onZoom(newDomain);
    }
  };

  const renderDates = () => {
    if (!dateFormatter) {
      return null;
    }

    const dates = domain.map(date => (
      <span key={date}>{dateFormatter(date)}</span>
    ));

    return <Dates data-test-id="dates">{dates}</Dates>;
  };

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    onEventsPropChanges();
  }, [events]);

  const zoomConfig = zoom ? { ...zoom, onZoom: onZoomCallback } : zoom;

  return (
    <Wrapper ref={wrapperRef}>
      {renderDates()}
      {width && Object.keys(timelines).length ? (
        <svg ref={svgRef} width={width} height={height}>
          <ChartLayout
            svg={svgRef}
            width={width}
            height={height}
            timelines={timelines}
            start={domain[0]}
            end={domain[1]}
            ruler={ruler}
            zoom={zoomConfig}
            timelineSize={{ height: tlHeight, bottom: tlBottom }}
          />
        </svg>
      ) : (
        <LoadingBlock height={'50px'} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 1px;
`;

const Dates = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
