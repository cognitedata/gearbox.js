import { Datapoint, Timeseries } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { timeseriesList } from '../../../mocks';
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

storiesOf('SensorOverlay', module).add(
  'Full description',
  () => (
    <SensorOverlay timeserieIds={[timeseriesList[0].id]}>
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
  .add(
    'Basic',
    () => (
      <SensorOverlay timeserieIds={[timeseriesList[0].id]}>
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
        timeserieIds={[
          timeseriesList[0].id,
          timeseriesList[1].id,
          timeseriesList[2].id,
          timeseriesList[3].id,
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
        timeserieIds={[timeseriesList[0].id]}
        colorMap={{ [timeseriesList[0].id]: '#33AA33' }}
        defaultPositionMap={{
          [timeseriesList[0].id]: {
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
        timeserieIds={[timeseriesList[0].id]}
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
        timeserieIds={[timeseriesList[0].id]}
        linksMap={{ [timeseriesList[0].id]: true }}
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
        timeserieIds={[timeseriesList[0].id]}
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
        timeserieIds={[timeseriesList[0].id]}
        stickyMap={{ [8681821313339919]: true }}
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
      class WrapperComponent extends React.Component {
        state = {
          counter: 0,
          timeserieIds: [],
        };
        render() {
          return (
            <div>
              <button
                style={{ marginBottom: 20 }}
                onClick={() =>
                  this.setState({
                    timeserieIds: [
                      ...this.state.timeserieIds,
                      timeseriesList[this.state.counter].id,
                    ],
                    counter: this.state.counter + 1,
                  })
                }
              >
                Add Sensor
              </button>
              <SensorOverlay timeserieIds={this.state.timeserieIds}>
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
