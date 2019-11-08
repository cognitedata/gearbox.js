import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { timeseriesListV2 as fakeTimeseries } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SensorOverlay } from '../SensorOverlay';
import addDynamically from './addDynamically.md';
import basic from './basic.md';
import defaultPosition from './defaultPosition.md';
import disabledDragging from './disabledDragging.md';
import fullDescription from './full.md';
import withFixedWidth from './withFixedWidth.md';
import withImage from './withImage.md';
import withLink from './withLink.md';
import withMany from './withMany.md';
import withMinMax from './withMinMax.md';
import withStickyTooltips from './withStickyTooltips.md';

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: (ids: any): Promise<GetTimeSeriesMetadataDTO[]> => {
      return new Promise(resolve => {
        setTimeout(() => {
          // @ts-ignore
          const timeserie = fakeTimeseries.find(ts => ts.id === ids[0].id);
          if (!timeserie) {
            throw new Error('Cannot find mocked timeseries');
          }
          resolve([timeserie]);
        }, Math.random() * 2000); // simulate load delay
      });
    },
  };
  datapoints: any = {
    retrieveLatest: (_: any) => {
      return Promise.resolve([
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
      ]);
    },
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

const ClientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={sdk}>{storyFn()}</ClientSDKProvider>
);

storiesOf('SensorOverlay', module)
  .addDecorator(ClientSDKDecorator)
  .add(
    'Full description',
    () => (
      <SensorOverlay timeseriesIds={[fakeTimeseries[0].id]}>
        <div style={{ width: '100%', height: '160px', background: '#EEE' }} />
      </SensorOverlay>
    ),
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('SensorOverlay/Examples', module)
  .addDecorator(ClientSDKDecorator)
  .add(
    'Basic',
    () => (
      <SensorOverlay timeseriesIds={[fakeTimeseries[0].id]}>
        <div style={{ width: '100%', height: '200px', background: '#EEE' }} />
      </SensorOverlay>
    ),
    {
      readme: {
        content: basic,
      },
    }
  )
  .add(
    'With many sensors',
    () => (
      <SensorOverlay
        timeseriesIds={[
          fakeTimeseries[0].id,
          fakeTimeseries[1].id,
          fakeTimeseries[2].id,
          fakeTimeseries[3].id,
        ]}
      >
        <div style={{ width: '100%', height: '220px', background: '#EEE' }} />
      </SensorOverlay>
    ),
    {
      readme: {
        content: withMany,
      },
    }
  )
  .add(
    'Default position and color',
    () => (
      <SensorOverlay
        timeseriesIds={[fakeTimeseries[0].id]}
        colorMap={{ [fakeTimeseries[0].id]: '#33AA33' }}
        defaultPositionMap={{
          [fakeTimeseries[0].id]: {
            left: 0.5,
            top: 0.2,
            pointer: {
              left: 0.4,
              top: 0.8,
            },
          },
        }}
        onClick={action('onClick')}
        onSettingsClick={action('onSettingsClick')}
        onSensorPositionChange={action('onSensorPositionChange')}
      >
        <div style={{ width: '100%', height: '250px', background: '#EEE' }} />
      </SensorOverlay>
    ),
    {
      readme: {
        content: defaultPosition,
      },
    }
  )
  .add(
    'Disabled Dragging',
    () => (
      <SensorOverlay
        timeseriesIds={[fakeTimeseries[0].id]}
        isTagDraggable={false}
        isPointerDraggable={false}
      >
        <div style={{ width: '100%', height: '200px', background: '#EEE' }} />
      </SensorOverlay>
    ),
    {
      readme: {
        content: disabledDragging,
      },
    }
  )
  .add(
    'With link',
    () => (
      <SensorOverlay
        timeseriesIds={[fakeTimeseries[0].id]}
        linksMap={{ [fakeTimeseries[0].id]: true }}
        onClick={action('onClick')}
        onLinkClick={action('onLinkClick')}
      >
        <div
          style={{ width: '100%', height: '200px', background: '#DDDDDD' }}
        />
      </SensorOverlay>
    ),
    {
      readme: {
        content: withLink,
      },
    }
  )
  .add(
    'With sticky tooltips',
    () => (
      <SensorOverlay
        timeseriesIds={[fakeTimeseries[0].id]}
        stickyMap={{ [8681821313339919]: true }}
        defaultPositionMap={{
          [8681821313339919]: {
            left: 0.5,
            top: 0.5,
            pointer: {
              left: 0.4,
              top: 0.8,
            },
          },
        }}
      >
        <div style={{ width: '100%', height: '250px', background: '#EEE' }} />
      </SensorOverlay>
    ),
    {
      readme: {
        content: withStickyTooltips,
      },
    }
  )
  .add(
    'With min-max limit',
    () => (
      <SensorOverlay
        timeseriesIds={[fakeTimeseries[0].id]}
        stickyMap={{ [8681821313339919]: true }}
        alertColor={'magenta'}
        minMaxMap={{
          [8681821313339919]: {
            min: 5,
            max: 10,
          },
        }}
      >
        <div style={{ width: '100%', height: '250px', background: '#EEE' }} />
      </SensorOverlay>
    ),
    {
      readme: {
        content: withMinMax,
      },
    }
  )
  .add(
    'With Image',
    () => (
      <SensorOverlay
        timeseriesIds={[fakeTimeseries[0].id]}
        colorMap={{ [fakeTimeseries[0].id]: 'orange' }}
        defaultPositionMap={{
          [fakeTimeseries[0].id]: {
            left: 0.2,
            top: 0.2,
            pointer: {
              left: 0.3,
              top: 0.4,
            },
          },
        }}
        onClick={action('onClick')}
        onSettingsClick={action('onSettingsClick')}
        onSensorPositionChange={action('onSensorPositionChange')}
      >
        <img src="sensor_overlay/infographic-sample.jpg" width="100%" />
      </SensorOverlay>
    ),
    {
      readme: {
        content: withImage,
      },
    }
  )
  .add(
    'With Fixed Width',
    () => (
      <SensorOverlay
        timeseriesIds={[fakeTimeseries[0].id]}
        colorMap={{ [fakeTimeseries[0].id]: 'orange' }}
        defaultPositionMap={{
          [fakeTimeseries[0].id]: {
            left: 0.2,
            top: 0.2,
            pointer: {
              left: 0.3,
              top: 0.4,
            },
          },
        }}
        fixedWidth={1000}
        onClick={action('onClick')}
        onSettingsClick={action('onSettingsClick')}
        onSensorPositionChange={action('onSensorPositionChange')}
      >
        <img src="sensor_overlay/infographic-sample.jpg" width="1000px" />
      </SensorOverlay>
    ),
    {
      readme: {
        content: withFixedWidth,
      },
    }
  )
  .add(
    'Add sensors dynamically',
    () => {
      // tslint:disable-next-line: max-classes-per-file
      class WrapperComponent extends React.Component {
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
      return <WrapperComponent />;
    },
    {
      readme: {
        content: addDynamically,
      },
    }
  );
