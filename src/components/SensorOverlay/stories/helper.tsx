// Copyright 2020 Cognite AS
import { Timeseries } from '@cognite/sdk';
import React from 'react';
import { sleep, timeseriesListV2 as fakeTimeseries } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SensorDatapoint } from '../interfaces';
import { SensorOverlay } from '../SensorOverlay';

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: async (ids: any): Promise<Timeseries[]> => {
      await sleep(Math.random() * 2000);
      // @ts-ignore
      const timeserie = fakeTimeseries.find(ts => ts.id === ids[0].id);
      if (!timeserie) {
        throw new Error('Cannot find mocked timeseries');
      }
      return [timeserie];
    },
  };
  datapoints: any = {
    retrieveLatest: async (_: any) => {
      return [
        {
          id: 1,
          isString: false,
          datapoints: [
            {
              timestamp: new Date(),
              value: Math.random() * 5.0,
            },
          ],
        },
      ];
    },
  };
}

export class SensorOverlayWrapperComponent extends React.Component {
  state = {
    counter: 0,
    timeseriesIds: [],
  };

  render() {
    return (
      <div>
        <button
          style={{ marginBottom: 20 }}
          onClick={() =>
            this.setState({
              timeseriesIds: [
                ...this.state.timeseriesIds,
                fakeTimeseries[this.state.counter].id,
              ],
              counter: this.state.counter + 1,
            })
          }
        >
          Add Sensor
        </button>
        <SensorOverlay timeseriesIds={this.state.timeseriesIds}>
          <div
            style={{
              width: '100%',
              height: '300px',
              background: '#EEE',
            }}
          />
        </SensorOverlay>
      </div>
    );
  }
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const CustomizedDiv = () => (
  <div style={{ width: '100%', height: '220px', background: '#EEE' }} />
);

export const timeseriesIds = [
  8681821313339919,
  4536015939766876,
  1762612637163055,
  7108578362782757,
];

export const colorMap = { [fakeTimeseries[0].id]: '#33AA33' };

export const defaultPositionMap = {
  [fakeTimeseries[0].id]: {
    left: 0.5,
    top: 0.2,
    pointer: {
      left: 0.4,
      top: 0.8,
    },
  },
};

export const linksMap = { [fakeTimeseries[0].id]: true };

export const handleClick = (timeserieId: number) =>
  console.log('handleClick', timeserieId);

export const handleLinkClick = (
  timeserieId: number,
  datapoint: SensorDatapoint
) => console.log('handleLinkClick', timeserieId, datapoint);

export const minMaxMap = {
  [8681821313339919]: {
    min: 5,
    max: 10,
  },
};

export const stickyMap = { [8681821313339919]: true };
