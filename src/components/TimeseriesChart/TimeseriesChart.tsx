import React from 'react';
import {
  cogniteloader as griffloader,
  y0Accessor,
  y1Accessor,
  yAccessor,
} from './dataLoader';

import {
  AxisDisplayMode,
  AxisPlacement,
  DataProvider,
  LineChart,
} from '@cognite/griff-react';
import { Spin } from 'antd';
import { decimalTickFormatter, getColor } from '../../utils';

export interface TimeseriesChartProps {
  panelHeight: number;
  timeseriesIds: number[];
  pointsPerSeries: number;
  start: number | Date;
  end: number | Date;
  contextChart: boolean;
  zoomable: boolean;
  liveUpdate: boolean;
  updateIntervalMillis: number;
  yAxisDisplayMode: 'ALL' | 'COLLAPSED' | 'NONE';
  yAxisPlacement: 'RIGHT' | 'LEFT' | 'BOTH';
}

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
    start: +Date.now() - 60 * 60 * 1000,
    end: +Date.now(),
    subDomain: null,
    timeseriesIds: [],
    pointsPerSeries: 600,
    updateIntervalMillis: 5000,

    zoomable: false,
    contextChart: false,
    yAxisDisplayMode: 'ALL',
    timeseriesColors: {},
    liveUpdate: false,
    yAxisPlacement: 'RIGHT',
    panelHeight: 500,
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
      start,
      end,
      pointsPerSeries,
      timeseriesIds,
      updateIntervalMillis,
      zoomable,
      contextChart,
      yAxisDisplayMode,
      panelHeight,
      liveUpdate,
      yAxisPlacement,
    } = this.props;

    const { loaded } = this.state;

    const griffSeries = timeseriesIds.map((id: number) => ({
      id,
      color: getColor(id.toString()),
      yAxisDisplayMode: AxisDisplayMode[yAxisDisplayMode],
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
              timeDomain={[+start, +end]}
              onFetchDataError={(e: Error) => {
                throw e;
              }}
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
                contextChart={{
                  visible: contextChart,
                  height: 100,
                  isDefault: true,
                }}
                yAxisFormatter={decimalTickFormatter}
                yAxisPlacement={AxisPlacement[yAxisPlacement]}
              />
            </DataProvider>
          </div>
        </Spin>
      )
    );
  }
}
