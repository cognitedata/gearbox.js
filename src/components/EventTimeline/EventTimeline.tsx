import React, { RefObject, createRef } from 'react';
import {
  select as d3Select,
  scaleTime as d3ScaleTime,
  min as d3Min,
  max as d3Max,
  zoom as d3Zoom,
  axisTop as d3AxisTop,
  event as d3Event,
  ScaleTime,
} from 'd3';
import moment from 'moment';
import { Spin } from 'antd';
import { VEventTimeline, VIdCallback } from 'utils/validators';

interface EventTimelineProps {
  barHeight: number;
  data: VEventTimeline[];
  isLoading: boolean;
  onEventClicked?: VIdCallback;
}

class EventTimeline extends React.Component<EventTimelineProps> {
  static defaultProps = {
    data: [],
    barHeight: 16,
    isLoading: false,
  };

  private node: RefObject<SVGSVGElement> = createRef<SVGSVGElement>();
  private xAxis: RefObject<SVGSVGElement> = createRef<SVGSVGElement>();
  private currentX: ScaleTime<number, number> = d3ScaleTime();
  private chart: any;
  private axis: any;

  componentDidMount() {
    const { data } = this.props;

    if (data.length) {
      this.createChart();
    }
  }

  componentDidUpdate(prevProps: EventTimelineProps) {
    const { data: prevData } = prevProps;
    const { data: currentData } = this.props;

    if (prevData.length !== currentData.length) {
      this.createChart();
    }
  }

  calculateWidth = (
    scale: ScaleTime<number, number>,
    eventData: VEventTimeline
  ): number => {
    const { barHeight: height } = this.props;

    if (
      this.instantaneous(eventData) ||
      height > scale(eventData.max) - scale(eventData.min) ||
      Number.isNaN(scale(eventData.max) - scale(eventData.min))
    ) {
      return height;
    }

    if (eventData.max === undefined) {
      // TODO: Find out why eventData.max is sometimes undefined from API
      return scale(+moment()) - scale(eventData.min);
    }

    return scale(eventData.max) - scale(eventData.min);
  };

  createChart = () => {
    const { data, onEventClicked, barHeight } = this.props;
    const width = (this.node.current && this.node.current.clientWidth) || 0;

    d3Select(this.node.current)
      .selectAll('*')
      .remove();

    const x0 = d3ScaleTime()
      .domain([
        d3Min(data, eventData => eventData.min) || +moment(),
        d3Max(data, eventData => eventData.max) || +moment(),
      ])
      .range([0, width]);

    this.currentX = x0.copy();
    this.chart = d3Select(this.node.current).attr(
      'height',
      barHeight * data.length + (4 * data.length - 1)
    );

    const bars = this.chart.append('g').attr('class', 'events');

    const bar = bars
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr(
        'transform',
        (_: VEventTimeline, i: number) => `translate(0, ${i * 4})`
      )
      .on(
        'click',
        (eventData: VEventTimeline) =>
          onEventClicked && onEventClicked(eventData.id)
      );

    bar
      .append('rect')
      .attr('class', 'event')
      .attr('style', 'cursor: pointer')
      .attr('x', (eventData: VEventTimeline) => this.currentX(eventData.min))
      .attr('y', (_: VEventTimeline, i: number) => i * barHeight)
      .attr('width', (eventData: VEventTimeline) =>
        this.calculateWidth(this.currentX, eventData)
      )
      .attr('height', barHeight)
      .attr('fill', (eventData: VEventTimeline) => eventData.color)
      .attr(
        'fill-opacity',
        (eventData: VEventTimeline) => eventData.fillOpacity || 1
      )
      .attr('stroke', (eventData: VEventTimeline) => eventData.color)
      .attr(
        'stroke-opacity',
        (eventData: VEventTimeline) => eventData.strokeOpacity || 1
      )
      .attr('stroke-width', 2)
      .attr('rx', (eventData: VEventTimeline) =>
        this.instantaneous(eventData) ? 0 : barHeight / 2
      )
      .attr('ry', (eventData: VEventTimeline) =>
        this.instantaneous(eventData) ? 0 : barHeight / 2
      );

    // Axis
    d3Select(this.xAxis.current)
      .selectAll('*')
      .remove();

    const zoom = d3Zoom()
      .scaleExtent([0, Infinity])
      .on('zoom', this.zoomed);

    this.axis = d3Select(this.xAxis.current)
      .attr('height', 32)
      // @ts-ignore
      .call(zoom);

    this.axis
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, 30)`)
      .call(d3AxisTop(this.currentX));
  };

  zoomed = () => {
    const t = d3Event.transform;
    const xt = t.rescaleX(this.currentX);
    this.chart
      .selectAll('.event')
      .attr('x', (eventData: VEventTimeline) => xt(eventData.min))
      .attr('width', (eventData: VEventTimeline) =>
        this.calculateWidth(xt, eventData)
      );
    this.axis.select('.x-axis').call(d3AxisTop(xt));
  };

  render() {
    const { isLoading } = this.props;

    return (
      <Spin spinning={isLoading}>
        <svg
          key="x-axis"
          ref={this.xAxis}
          style={{
            width: '100%',
            position: 'sticky',
            top: '0px',
            backgroundColor: '#f0f2f5',
            cursor: 'move',
          }}
        />
        <div key="chart">
          <svg ref={this.node} style={{ width: '100%' }} />
        </div>
      </Spin>
    );
  }

  private instantaneous = (eventData: VEventTimeline) =>
    Math.abs(eventData.max - eventData.min) < 1000;
}

export default EventTimeline;
