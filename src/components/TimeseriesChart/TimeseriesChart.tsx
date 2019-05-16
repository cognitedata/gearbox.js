import React from 'react';
import styled from 'styled-components';
import {
  cogniteloader as griffloader,
  y0Accessor,
  y1Accessor,
  yAccessor,
} from './dataLoader';

import {
  Annotation,
  AxisDisplayMode,
  AxisPlacement,
  DataProvider,
  LineChart,
  Ruler,
} from '@cognite/griff-react';
import { Spin } from 'antd';
import { decimalTickFormatter, getColor } from '../../utils';

const Wrapper = styled.div`
  height: 500px;
  width: 100%;
`;

export interface TimeseriesChartStyles {
  container?: React.CSSProperties;
}

export type TimeseriesChartProps = {
  styles?: TimeseriesChartStyles;
  pointsPerSeries: number;
  startTime: number | Date;
  endTime: number | Date;
  contextChart: boolean;
  zoomable: boolean;
  liveUpdate: boolean;
  crosshair: boolean;
  updateIntervalMillis: number;
  timeseriesColors: { [id: number]: string };
  hiddenSeries: { [id: number]: boolean };
  annotations: Annotation[];
  ruler: Ruler;
  collections: any;
  xAxisHeight: number;
  yAxisDisplayMode: 'ALL' | 'COLLAPSED' | 'NONE';
  yAxisPlacement: 'RIGHT' | 'LEFT' | 'BOTH';
  height?: number;
  width?: number;
  onMouseMove?: (e: any) => void;
  onBlur?: (e: any) => void;
  onMouseOut?: (e: any) => void;
  onFetchDataError: (e: Error) => void;
} & ({ timeseriesIds: number[] } | { series: any });

interface TimeseriesChartState {
  loaded: boolean;
}

// Don't allow updating faster than every 1000ms.
const MINIMUM_UPDATE_FREQUENCY_MILLIS = 1000;

export class TimeseriesChart extends React.Component<
  TimeseriesChartProps,
  TimeseriesChartState
> {
  static defaultProps = {
    startTime: Date.now() - 60 * 60 * 1000,
    endTime: Date.now(),
    pointsPerSeries: 600,
    updateIntervalMillis: 5000,
    zoomable: false,
    contextChart: false,
    crosshair: false,
    yAxisDisplayMode: 'ALL',
    liveUpdate: false,
    yAxisPlacement: 'RIGHT',
    height: undefined,
    width: undefined,
    timeseriesColors: {},
    hiddenSeries: {},
    annotations: [],
    xAxisHeight: 50,
    collections: {},
    ruler: undefined,
    onFetchDataError: (e: Error) => {
      throw e;
    },
  };
  state = {
    loaded: false,
  };

  onFetchData = () => {
    if (!this.state.loaded) {
      this.setState({ loaded: true });
    }
  };

  render() {
    const {
      startTime,
      endTime,
      pointsPerSeries,
      // @ts-ignore
      timeseriesIds,
      // @ts-ignore
      series,
      collections,
      updateIntervalMillis,
      zoomable,
      crosshair,
      contextChart,
      xAxisHeight,
      timeseriesColors,
      yAxisDisplayMode,
      styles,
      liveUpdate,
      yAxisPlacement,
      hiddenSeries,
      annotations,
      ruler,
      height,
      width,
      onMouseMove,
      onMouseOut,
      onBlur,
      onFetchDataError,
    } = this.props;

    const { loaded } = this.state;

    const griffSeries = series
      ? series.map((s: any) => ({
          ...s,
          id: s.id,
          color: s.color || timeseriesColors[s.id] || getColor(s.id.toString()),
          yAxisDisplayMode:
            s.yAxisDisplayMode || AxisDisplayMode[yAxisDisplayMode],
          hidden: s.hidden || hiddenSeries[s.id],
          yAccessor: s.yAccessor || yAccessor,
          y0Accessor: s.y0Accessor || y0Accessor,
          y1Accessor: s.y1Accessor || y1Accessor,
        }))
      : timeseriesIds.map((id: number) => ({
          id,
          color: timeseriesColors[id] || getColor(id.toString()),
          yAxisDisplayMode: AxisDisplayMode[yAxisDisplayMode],
          hidden: hiddenSeries[id],
          yAccessor,
          y0Accessor,
          y1Accessor,
        }));

    return (
      griffSeries.length !== 0 && (
        <Spin spinning={!loaded}>
          <Wrapper style={styles && styles.container}>
            <DataProvider
              defaultLoader={griffloader}
              onFetchData={this.onFetchData}
              pointsPerSeries={pointsPerSeries}
              series={griffSeries}
              collections={[...new Set(Object.values(collections))].map(
                (unit: any) => ({
                  id: unit,
                  color: getColor(unit),
                  yAxisDisplayMode: AxisPlacement[yAxisPlacement],
                })
              )}
              timeDomain={[+startTime, +endTime]}
              onFetchDataError={onFetchDataError}
              updateInterval={
                liveUpdate
                  ? Math.max(
                      updateIntervalMillis,
                      MINIMUM_UPDATE_FREQUENCY_MILLIS
                    )
                  : 0
              }
            >
              <LineChart
                zoomable={zoomable}
                crosshair={crosshair}
                annotations={annotations}
                contextChart={{
                  visible: contextChart,
                  height: 100,
                  isDefault: true,
                }}
                height={height}
                width={width}
                ruler={ruler}
                yAxisFormatter={decimalTickFormatter}
                yAxisPlacement={AxisPlacement[yAxisPlacement]}
                xAxisHeight={xAxisHeight}
                onMouseMove={onMouseMove}
                onMouseOut={onMouseOut}
                onBlur={onBlur}
              />
            </DataProvider>
          </Wrapper>
        </Spin>
      )
    );
  }
}
