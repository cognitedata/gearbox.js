// Copyright 2020 Cognite AS
import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../../hoc';
import { Theme } from '../../../interfaces';
import { defaultTheme } from '../../../theme/defaultTheme';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../../../utils/promise';

interface TimeseriesValueProps {
  timeseriesDescription?: string;
  timeseriesId: number;
  liveUpdate?: boolean;
  updatePeriodMillis?: number;
  unit?: string;
  theme?: Theme;
}

interface TimeseriesValueState {
  value: string | null;
  lastTimestamp: Date | null;
}

class TimeseriesValue
  extends React.PureComponent<TimeseriesValueProps, TimeseriesValueState>
  implements ComponentWithUnmountState {
  static contextType = ClientSDKProxyContext;
  static defaultProps = {
    liveUpdate: true,
    timeseriesDescription: '',
    updatePeriodMillis: 5000,
    theme: { ...defaultTheme },
  };

  isComponentUnmounted = false;
  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;

  state = {
    value: null,
    lastTimestamp: null,
  };

  private interval: number | null = null;

  componentDidMount() {
    this.client = this.context(Component.displayName || '')!;
    if (!this.client) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
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
    if (prevProps.timeseriesId !== this.props.timeseriesId) {
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
      const datapoints = await connectPromiseToUnmountState(
        this,
        this.client.datapoints.retrieveLatest([
          { id: this.props.timeseriesId, before: 'now' },
        ])
      );

      if (
        !datapoints ||
        !datapoints[0] ||
        !datapoints[0].datapoints ||
        !datapoints[0].datapoints[0]
      ) {
        this.setState({
          value: null,
          lastTimestamp: null,
        });
        return;
      }
      const datapoint = datapoints[0].datapoints[0];
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

const Description = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.gearbox.textColorSecondary};
`;

const Component = withDefaultTheme(TimeseriesValue);
Component.displayName = 'TimeseriesValue';

export { Component as TimeseriesValue };
