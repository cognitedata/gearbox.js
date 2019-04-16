import React from 'react';
import * as sdk from '@cognite/sdk';
import { Datapoint, Timeseries } from '@cognite/sdk';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SensorOverlay from 'components/SensorOverlay/SensorOverlay';
import { timeseriesList } from 'mocks/timeseriesList';

sdk.TimeSeries.retrieve = (id: number, _): Promise<Timeseries> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const timeserie = timeseriesList.find(ts => ts.id === id);
      if (!timeserie) {
        throw new Error('Cannot find mocked timeseries');
      }
      resolve(timeserie);
    }, Math.random() * 2000); // simulate load delay
  });
};

sdk.Datapoints.retrieveLatest = async (name: string): Promise<Datapoint> => {
  return {
    timestamp: Date.now(),
    value: name.length + Math.random() * 5.0, // just random number
  };
};

storiesOf('SensorOverlay', module)
  .add('Basic', () => (
    <SensorOverlay timeserieIds={[8681821313339919]}>
      <div style={{ width: '100%', height: '500px', background: '#DDDDDD' }} />
    </SensorOverlay>
  ))
  .add('Basic with two', () => (
    <SensorOverlay timeserieIds={[8681821313339919, 4536015939766876]}>
      <div style={{ width: '100%', height: '500px', background: '#DDDDDD' }} />
    </SensorOverlay>
  ))
  .add('Default position and color', () => (
    <SensorOverlay
      timeserieIds={[8681821313339919]}
      colorMap={{ '8681821313339919': '#33AA33' }}
      defaultPositionMap={{
        '8681821313339919': {
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
      <div style={{ width: '100%', height: '500px', background: '#DDDDDD' }} />
    </SensorOverlay>
  ))
  .add('Disabled Dragging', () => (
    <SensorOverlay
      timeserieIds={[8681821313339919]}
      colorMap={{ '8681821313339919': '#33AA33' }}
      isTagDraggable={false}
      isPointerDraggable={false}
      defaultPositionMap={{
        '8681821313339919': {
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
    >
      <div style={{ width: '100%', height: '500px', background: '#DDDDDD' }} />
    </SensorOverlay>
  ))
  .add('With link', () => (
    <SensorOverlay
      timeserieIds={[8681821313339919]}
      colorMap={{ '8681821313339919': '#33AA33' }}
      linksMap={{ '8681821313339919': true }}
      defaultPositionMap={{
        '8681821313339919': {
          left: 0.2,
          top: 0.2,
          pointer: {
            left: 0.3,
            top: 0.4,
          },
        },
      }}
      onClick={action('onClick')}
      onLinkClick={action('onLinkClick')}
      onSettingsClick={action('onSettingsClick')}
      onSensorPositionChange={action('onSensorPositionChange')}
    >
      <div style={{ width: '100%', height: '500px', background: '#DDDDDD' }} />
    </SensorOverlay>
  ))
  .add('With Image', () => (
    <SensorOverlay
      timeserieIds={[8681821313339919]}
      colorMap={{ '8681821313339919': 'orange' }}
      defaultPositionMap={{
        '8681821313339919': {
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
      <img
        src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-738495.jpg"
        width="100%"
      />
    </SensorOverlay>
  ))
  .add('With Fixed Image', () => (
    <SensorOverlay
      timeserieIds={[8681821313339919]}
      colorMap={{ '8681821313339919': 'orange' }}
      defaultPositionMap={{
        '8681821313339919': {
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
      <img
        src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-738495.jpg"
        width="1000px"
      />
    </SensorOverlay>
  ));
