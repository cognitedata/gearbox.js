/* eslint-disable react/no-multi-comp */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SensorOverlay from 'components/SensorOverlay/SensorOverlay';
import { SensorLabelConstantsMap } from 'components/SensorOverlay/SensorOverlay';

const timeseriesNames = ['Timeseries1', 'Timeseries2', 'Timeseries3'];

const sensorTagPositions = {
  Timeseries1: {
    left: 200,
    top: 100,
    pointer: {
      left: 270,
      top: 170,
    },
    distToCamera: 0,
  },
  Timeseries2: {
    left: 700,
    top: 50,
    pointer: {
      left: 900,
      top: 100,
    },
    distToCamera: 0,
  },
  Timeseries3: {
    left: 400,
    top: 300,
    pointer: {
      left: 500,
      top: 200,
    },
    distToCamera: 0,
  },
};
const sensorConstants: SensorLabelConstantsMap = {
  Timeseries1: {
    timeseries: {
      name: 'Timeseries1',
      description: 'The first timeseries',
      unit: 'm/s',
    },
    nodeId: 0,
    color: '#FF0000',
    threeDPos: {},
  },
  Timeseries2: {
    timeseries: {
      name: 'Timeseries2',
      description: 'The second timeseries',
      unit: '\u2103',
    },
    nodeId: 1,
    color: '#00CC00',
    threeDPos: {},
  },
  Timeseries3: {
    timeseries: {
      name: 'Timeseries3',
      description: 'The third timeseries',
      unit: 'ms',
    },
    nodeId: 2,
    color: '#0000FF',
    threeDPos: {},
  },
};

const sensorValues = {
  Timeseries1: 52,
  Timeseries2: 23,
  Timeseries3: 71,
};

const WrapperDecorator = (storyFn: () => any) => (
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
  .addDecorator(WrapperDecorator)
  .add('Base', () => (
    <SensorOverlay
      timeseriesNames={timeseriesNames}
      sensorTagPositions={sensorTagPositions}
      sensorConstants={sensorConstants}
      sensorValues={sensorValues}
      onClick={action('onClick')}
      onSettingsClick={action('onSettingsClick')}
    />
  ));
