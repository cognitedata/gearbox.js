import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import moment from 'moment';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { WithTimeseriesDataProps } from '../../hoc/interfaces';
import { TimeseriesChart } from '../TimeseriesChart';
import { TimeseriesMetaInfo } from './components/TimeseriesMetaInfo';
import { TimeseriesValue } from './components/TimeseriesValue';
import {
  TimeseriesChartMetaBase,
  TimeseriesChartMetaPeriod,
} from './interfaces';

export const timeScales: { [key: string]: { unit: string; number: number } } = {
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

export interface TimeseriesChartMetaPureProps
  extends WithTimeseriesDataProps,
    TimeseriesChartMetaBase {}

interface TimeseriesChartMetaState {
  timePeriod: TimeseriesChartMetaPeriod;
  basePeriod: {
    startTime: number;
    endTime: number;
  };
}

export class TimeseriesChartMetaPure extends PureComponent<
  TimeseriesChartMetaPureProps,
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

  constructor(props: TimeseriesChartMetaPureProps) {
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
            data-test-id="timeseries-chart"
            series={[timeseries.id]}
            liveUpdate={liveUpdate}
            updateInterval={updateIntervalMillis}
            start={basePeriod.startTime}
            end={basePeriod.endTime}
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
