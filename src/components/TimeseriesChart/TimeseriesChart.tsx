import React from 'react';
import {
  cogniteloader as griffloader,
  yAccessor,
  y0Accessor,
  y1Accessor,
} from 'utils/dataLoader';

import {
  AxisDisplayModeType,
  AxisDisplayMode,
  DataProvider,
  LineChart,
} from '@cognite/griff-react';
import { getColor } from 'utils/colors';
import { decimalTickFormatter } from 'utils/axisSigFix';
import { Spin } from 'antd';

export interface TimeseriesChartProps {
  panelHeight: number;
  timeseriesNames: string[];
  pointsPerSeries: number;
  start: number;
  end: number;
  timeseriesColors: {
    [name: string]: string;
  };
  contextChart: boolean;
  zoomable: boolean;
  liveUpdate: boolean;
  updateIntervalMillis: number;
  yDomain: number[];
  yAxisDisplayMode: AxisDisplayModeType;
  onFetchDataError: (error: Error) => void;
}

interface TimeseriesChartState {
  loaded: boolean;
}

// Don't allow updating faster than every 1000ms.
const MINIMUM_UPDATE_FREQUENCY_MILLIS = 1000;

class TimeseriesChart extends React.Component<
  TimeseriesChartProps,
  TimeseriesChartState
> {
  static defaultProps = {
    start: +Date.now() - 60 * 60 * 1000,
    end: +Date.now(),
    subDomain: null,
    timeseriesNames: [],
    pointsPerSeries: 600,
    updateIntervalMillis: 5000,
    annotations: [],
    zoomable: false,
    contextChart: false,
    yDomain: null,
    yAxisDisplayMode: AxisDisplayMode.ALL,
    timeseriesColors: {},
    liveUpdate: false,
    // Just rethrow the error if there is no custom error handler
    onFetchDataError: (e: Error) => {
      throw e;
    },
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
      timeseriesNames,
      updateIntervalMillis,
      zoomable,
      contextChart,
      yDomain,
      yAxisDisplayMode,
      timeseriesColors,
      onFetchDataError,
      panelHeight,
      liveUpdate,
    } = this.props;

    const { loaded } = this.state;

    const griffSeries = timeseriesNames.map((name: string) => ({
      id: name,
      name,
      color: timeseriesColors[name] || getColor(name),
      yAxisDisplayMode,
      yAccessor,
      y0Accessor,
      y1Accessor,
      yDomain,
      ySubDomain: yDomain,
    }));

    return (
      griffSeries.length !== 0 && (
        <Spin spinning={!loaded}>
          <div style={{ height: panelHeight }}>
            <DataProvider
              defaultLoader={griffloader}
              onFetchData={this.onFetchData}
              onFetchDataError={onFetchDataError}
              pointsPerSeries={pointsPerSeries}
              series={griffSeries}
              timeDomain={[start, end]}
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
              />
            </DataProvider>
          </div>
        </Spin>
      )
    );
  }
}

export default TimeseriesChart;
