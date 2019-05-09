import React from 'react';
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

export type TimeseriesChartProps = {
  panelHeight: number;
  pointsPerSeries: number;
  startTime: number | Date;
  endTime: number | Date;
  contextChart: boolean;
  zoomable: boolean;
  liveUpdate: boolean;
  updateIntervalMillis: number;
  timeseriesColors: { [id: number]: string };
  hiddenSeries: { [id: number]: boolean };
  annotations: Annotation[];
  ruler: Ruler;
  xAxisHeight: number;
  yAxisDisplayMode: 'ALL' | 'COLLAPSED' | 'NONE';
  yAxisPlacement: 'RIGHT' | 'LEFT' | 'BOTH';
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
    startTime: +Date.now() - 60 * 60 * 1000,
    endTime: +Date.now(),
    pointsPerSeries: 600,
    updateIntervalMillis: 5000,
    zoomable: false,
    contextChart: false,
    yAxisDisplayMode: 'ALL',
    liveUpdate: false,
    yAxisPlacement: 'RIGHT',
    panelHeight: 500,
    timeseriesColors: {},
    hiddenSeries: {},
    annotations: [],
    xAxisHeight: 50,
    ruler: {},
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
      updateIntervalMillis,
      zoomable,
      contextChart,
      xAxisHeight,
      timeseriesColors,
      yAxisDisplayMode,
      panelHeight,
      liveUpdate,
      yAxisPlacement,
      hiddenSeries,
      annotations,
      ruler,
      onMouseMove,
      onMouseOut,
      onBlur,
      onFetchDataError,
    } = this.props;

    const { loaded } = this.state;

    const griffSeries = series
      ? series
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
          <div style={{ height: panelHeight }}>
            <DataProvider
              defaultLoader={griffloader}
              onFetchData={this.onFetchData}
              pointsPerSeries={pointsPerSeries}
              series={griffSeries}
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
                crosshair={false}
                annotations={annotations}
                contextChart={{
                  visible: contextChart,
                  height: 100,
                  isDefault: true,
                }}
                ruler={ruler}
                yAxisFormatter={decimalTickFormatter}
                yAxisPlacement={AxisPlacement[yAxisPlacement]}
                xAxisHeight={xAxisHeight}
                onMouseMove={onMouseMove}
                onMouseOut={onMouseOut}
                onBlur={onBlur}
              />
            </DataProvider>
          </div>
        </Spin>
      )
    );
  }
}
