import React from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../../constants/errorMessages';
import { ClientSDKContext } from '../../../context/clientSDKContext';
import { defaultTheme } from '../../../theme/defaultTheme';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../../../utils/promise';

interface TimeseriesValueProps {
  timeseriesDescription?: string;
  timeseriesName: string;
  liveUpdate?: boolean;
  updatePeriodMillis?: number;
  unit?: string;
}

interface TimeseriesValueState {
  value: string | null;
  lastTimestamp: Date | null;
}

export class TimeseriesValue
  extends React.PureComponent<TimeseriesValueProps, TimeseriesValueState>
  implements ComponentWithUnmountState {
  static contextType = ClientSDKContext;
  static defaultProps = {
    liveUpdate: true,
    timeseriesDescription: '',
    updatePeriodMillis: 5000,
  };

  isComponentUnmounted = false;
  context!: React.ContextType<typeof ClientSDKContext>;

  state = {
    value: null,
    lastTimestamp: null,
  };

  private interval: number | null = null;

  componentDidMount() {
    if (!this.context) {
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
      const datapoints = await connectPromiseToUnmountState(
        this,
        // @ts-ignore
        this.context.datapoints.retrieveLatest([
          { externalId: this.props.timeseriesName, before: 'now' },
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
