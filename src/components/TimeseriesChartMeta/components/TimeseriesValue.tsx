import * as sdk from '@cognite/sdk';
import React from 'react';
import styled from 'styled-components';
import { defaultTheme } from '../../../theme/defaultTheme';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../../../utils/promise';

interface TimeseriesValueProps {
  timeseriesDescription?: string;
  timeseriesName: string;
  liveUpdate: boolean;
  updatePeriodMillis: number;
  unit?: string;
}

interface TimeseriesValueState {
  value: string | null;
  lastTimestamp: number | null;
}

export class TimeseriesValue
  extends React.PureComponent<TimeseriesValueProps, TimeseriesValueState>
  implements ComponentWithUnmountState {
  isComponentUnmounted = false;

  state = {
    value: null,
    lastTimestamp: null,
  };

  private interval: number | null = null;

  componentDidMount() {
    this.getLatestDatapoint();
    if (this.props.liveUpdate) {
      this.interval = setInterval(
        this.getLatestDatapoint,
        this.props.updatePeriodMillis
      );
    }
  }

  componentWillUnmount() {
    this.isComponentUnmounted = true;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  componentDidUpdate(prevProps: TimeseriesValueProps) {
    if (prevProps.timeseriesName !== this.props.timeseriesName) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.getLatestDatapoint();
      this.interval = setInterval(
        this.getLatestDatapoint,
        this.props.updatePeriodMillis
      );
    }
  }

  getLatestDatapoint = async () => {
    try {
      const datapoint = await connectPromiseToUnmountState(
        this,
        sdk.Datapoints.retrieveLatest(this.props.timeseriesName)
      );

      if (!datapoint) {
        this.setState({
          value: null,
          lastTimestamp: null,
        });
        return;
      }
      if (
        this.state.lastTimestamp !== null &&
        datapoint.timestamp < this.state.lastTimestamp!
      ) {
        return; // old data point - skip it
      }
      this.setState({
        value:
          typeof datapoint.value === 'number'
            ? datapoint.value.toFixed(3)
            : datapoint.value || null,
        lastTimestamp: datapoint.timestamp,
      });
    } catch (error) {
      if (error instanceof CanceledPromiseException !== true) {
        throw error;
      }
    }
  };

  render() {
    return (
      <Container>
        <Value>
          {this.state.value}
          {this.props.unit && <sup>{this.props.unit}</sup>}
        </Value>
        <Description>{this.props.timeseriesDescription}</Description>
      </Container>
    );
  }
}

const Container = styled.div`
  max-width: 230px;
  text-align: left;
`;

const Value = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.gearbox.textColor};
`;

Value.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};

const Description = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.gearbox.textColorSecondary};
`;

Description.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};
