import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import moment from 'moment';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { WithTimeseriesDataProps } from '../../hoc/withTimeseries';
import { TimeseriesChart } from '../TimeseriesChart';
import { TimeseriesMetaInfo } from './components/TimeseriesMetaInfo';
import { TimeseriesValue } from './components/TimeseriesValue';

const timeScales: { [key: string]: { unit: string; number: number } } = {
  last10Years: {
    unit: 'years',
    number: 10,
  },
  lastYear: {
    unit: 'year',
    number: 1,
  },
  lastMonth: {
    unit: 'month',
    number: 1,
  },
  lastWeek: {
    unit: 'week',
    number: 1,
  },
  lastDay: {
    unit: 'day',
    number: 1,
  },
  lastHour: {
    unit: 'hour',
    number: 1,
  },
  last15minutes: {
    unit: 'minutes',
    number: 15,
  },
};

export type TimeseriesChartMetaPeriod = keyof typeof timeScales;

export interface TimeseriesChartMetaProps extends WithTimeseriesDataProps {
  /**
   * Defines whether to get live updates in chart and data point
   */
  liveUpdate?: boolean;
  /**
   * Interval in milliseconds for live updates
   */
  updateIntervalMillis?: number;
  /**
   *  One of six predefined time periods: `'lastYear'`, `'lastMonth'`, `'lastWeek'`, `'lastDay'`, `'lastHour'`, `'last15Minutes'`
   */
  defaultTimePeriod?: TimeseriesChartMetaPeriod;
  /**
   * Custom time period for TimeseriesChart. This prop overrides defaultTimePeriod. Time values should be in timestamp format.
   */
  defaultBasePeriod?: {
    startTime: number;
    endTime: number;
  };
  /**
   * Defines whether to show description of the timeseries
   */
  showDescription?: boolean;
  /**
   * Defines whether to show time periods radio buttons
   */
  showPeriods?: boolean;
  /**
   * Defines whether to show timeseries chart
   */
  showChart?: boolean;
  /**
   * Defines whether to show current data point (sensor value)
   */
  showDatapoint?: boolean;
  /**
   * Defines whether to show meta data of the timeseries
   */
  showMetadata?: boolean;
}

interface TimeseriesChartMetaState {
  timePeriod: TimeseriesChartMetaPeriod;
  basePeriod: {
    startTime: number;
    endTime: number;
  };
}

export class TimeseriesChartMetaPure extends PureComponent<
  TimeseriesChartMetaProps,
  TimeseriesChartMetaState
> {
  static defaultProps = {
    liveUpdate: true,
    updateIntervalMillis: 5000,
    defaultTimePeriod: 'lastHour',
    showDescription: true,
    showPeriods: true,
    showChart: true,
    showDatapoint: true,
    showMetadata: true,
  };

  constructor(props: TimeseriesChartMetaProps) {
    super(props);
    this.state = {
      timePeriod: props.defaultBasePeriod ? '-' : props.defaultTimePeriod!,
      basePeriod:
        props.defaultBasePeriod || this.getBasePeriod(props.defaultTimePeriod!),
    };
  }

  getBasePeriod(
    period: TimeseriesChartMetaPeriod
  ): { startTime: number; endTime: number } {
    const { number: substructNumber, unit } = timeScales[period];
    return {
      // @ts-ignore
      startTime: +moment().subtract(substructNumber, unit),
      endTime: +moment(),
    };
  }

  handlePeriodChange = (e: RadioChangeEvent) => {
    const key = e.target.value;
    this.setState({
      basePeriod: this.getBasePeriod(key),
      timePeriod: key,
    });
  };

  render() {
    const {
      liveUpdate,
      showDescription,
      showPeriods,
      showChart,
      showDatapoint,
      showMetadata,
      timeseries,
      updateIntervalMillis,
    } = this.props;
    const { basePeriod, timePeriod } = this.state;

    if (!timeseries) {
      return null;
    }

    return (
      <Container>
        {showDescription && <Description>{timeseries.description}</Description>}
        {showPeriods && (
          <CenterWrapper>
            <Radio.Group value={timePeriod} onChange={this.handlePeriodChange}>
              {Object.keys(timeScales).map(key => (
                <Radio.Button key={key} value={key}>
                  {`${timeScales[key].number} ${timeScales[key].unit}`}
                </Radio.Button>
              ))}
            </Radio.Group>
          </CenterWrapper>
        )}
        {showChart && (
          <TimeseriesChart
            timeseriesIds={[timeseries.id]}
            liveUpdate={liveUpdate}
            updateIntervalMillis={updateIntervalMillis}
            startTime={basePeriod.startTime}
            endTime={basePeriod.endTime}
          />
        )}
        {showDatapoint && (
          <CenterWrapper>
            <TimeseriesValue
              timeseriesId={timeseries.id}
              timeseriesDescription={timeseries.description}
              liveUpdate={liveUpdate}
              updatePeriodMillis={updateIntervalMillis}
              unit={timeseries.unit}
            />
          </CenterWrapper>
        )}
        {showMetadata && (
          <CenterWrapper>
            <TimeseriesMetaInfo metaInfo={timeseries.metadata || {}} />
          </CenterWrapper>
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  display: block;
  width: 100%;
`;

const Description = styled.p`
  text-align: left;
`;

const CenterWrapper = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;
