import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SensorOverlay from 'components/SensorOverlay/SensorOverlay';
import {
  eventNames,
  eventConstants,
  eventPositions,
  sensorConstants,
  sensorTagPositions,
  sensorValues,
  timeseriesNames,
} from './SensorOverlayTestData';

const wrapperDecorator = (storyFn: () => any) => (
  <div
    style={{
      width: '100%',
      height: '500px',
      position: 'relative',
      pointerEvents: 'none',
    }}
  >
    {storyFn()}
  </div>
);

storiesOf('SensorOverlay', module)
  .addDecorator(wrapperDecorator)
  .add('Base', () => (
    <SensorOverlay
      timeseriesNames={timeseriesNames}
      sensorTagPositions={sensorTagPositions}
      sensorConstants={sensorConstants}
      sensorValues={sensorValues}
      eventNames={eventNames}
      eventPositions={eventPositions}
      eventConstants={eventConstants}
      onClick={action('onClick')}
      onSettingsClick={action('onSettingsClick')}
    />
  ));
