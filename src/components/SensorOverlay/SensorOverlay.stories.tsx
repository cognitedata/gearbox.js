import React from 'react';
import * as sdk from '@cognite/sdk';
import { Datapoint, Timeseries } from '@cognite/sdk';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SensorOverlay } from './SensorOverlay';
import { timeseriesList } from '../../mocks';

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
    <SensorOverlay timeserieIds={[timeseriesList[0].id]}>
      <div style={{ width: '100%', height: '500px', background: '#DDDDDD' }} />
    </SensorOverlay>
  ))
  .add('With many sensors', () => (
    <SensorOverlay
      timeserieIds={[
        timeseriesList[0].id,
        timeseriesList[1].id,
        timeseriesList[2].id,
        timeseriesList[3].id,
      ]}
    >
      <div style={{ width: '100%', height: '500px', background: '#DDDDDD' }} />
    </SensorOverlay>
  ))
  .add('Default position and color', () => (
    <SensorOverlay
      timeserieIds={[timeseriesList[0].id]}
      colorMap={{ [timeseriesList[0].id]: '#33AA33' }}
      defaultPositionMap={{
        [timeseriesList[0].id]: {
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
      timeserieIds={[timeseriesList[0].id]}
      colorMap={{ [timeseriesList[0].id]: '#33AA33' }}
      isTagDraggable={false}
      isPointerDraggable={false}
      defaultPositionMap={{
        [timeseriesList[0].id]: {
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
      timeserieIds={[timeseriesList[0].id]}
      linksMap={{ [timeseriesList[0].id]: true }}
      defaultPositionMap={{
        [timeseriesList[0].id]: {
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
  .add('With sticky tooltips', () => (
    <SensorOverlay
      timeserieIds={[timeseriesList[0].id]}
      stickyMap={{ [timeseriesList[0].id]: true }}
      defaultPositionMap={{
        [timeseriesList[0].id]: {
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
  .add('With Image', () => (
    <SensorOverlay
      timeserieIds={[timeseriesList[0].id]}
      colorMap={{ [timeseriesList[0].id]: 'orange' }}
      defaultPositionMap={{
        [timeseriesList[0].id]: {
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
      timeserieIds={[timeseriesList[0].id]}
      colorMap={{ [timeseriesList[0].id]: 'orange' }}
      defaultPositionMap={{
        [timeseriesList[0].id]: {
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
