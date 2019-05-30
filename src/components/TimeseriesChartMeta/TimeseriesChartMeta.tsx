import { Timeseries } from '@cognite/sdk';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import moment from 'moment-timezone';
import React from 'react';
import styled from 'styled-components';
import { TimeseriesChart } from '../TimeseriesChart';
import { TimeseriesMetaInfo } from './components/TimeseriesMetaInfo';
import { TimeseriesValue } from './components/TimeseriesValue';

const timeScales: { [key: string]: { unit: string; number: number } } = {
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

export interface TimeseriesChartMetaProps {
  // timeseriesId: number;
  timeseries: Timeseries;
  liveUpdate: boolean;
  updateIntervalMillis: number;
  showDescription: boolean;
  showPeriods: boolean;
  showChart: boolean;
  showDatapoint: boolean;
  showMetadata: boolean;
}

interface TimeseriesChartMetaState {
  timePeriod: string;
  basePeriod: {
    startTime: number;
    endTime: number;
  };
}

export class TimeseriesChartMeta extends React.PureComponent<
  TimeseriesChartMetaProps,
  TimeseriesChartMetaState
> {
  static defaultProps = {
    liveUpdate: true,
    updateIntervalMillis: '5000',
    showDescription: true,
    showPeriods: true,
    showChart: true,
    showDatapoint: true,
    showMetadata: true,
  };

  constructor(props: TimeseriesChartMetaProps) {
    super(props);
    const timePeriod = 'lastHour';
    this.state = {
      timePeriod,
      basePeriod: this.getBasePeriod(timePeriod),
    };
  }

  getBasePeriod(period: string): { startTime: number; endTime: number } {
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
      timeseries,
      updateIntervalMillis,
      showDescription,
      showPeriods,
      showChart,
      showDatapoint,
      showMetadata,
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
              <Radio.Button value="lastYear">1 year</Radio.Button>
              <Radio.Button value="lastMonth">1 month</Radio.Button>
              <Radio.Button value="lastWeek">1 week</Radio.Button>
              <Radio.Button value="lastHour">1 hour</Radio.Button>
              <Radio.Button value="last15minutes">15 minutes</Radio.Button>
            </Radio.Group>
          </CenterWrapper>
        )}
        {showChart && (
          <TimeseriesChart
            timeseriesIds={[timeseries.id]}
            liveUpdate={true}
            updateIntervalMillis={updateIntervalMillis}
            startTime={basePeriod.startTime}
            endTime={basePeriod.endTime}
          />
        )}
        {showDatapoint && (
          <CenterWrapper>
            <TimeseriesValue
              timeseriesName={timeseries.name}
              timeseriesDescription={timeseries.description}
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
