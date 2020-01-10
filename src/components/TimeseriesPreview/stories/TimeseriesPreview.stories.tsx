import {
  DatapointsGetDatapoint,
  GetDoubleDatapoint,
  GetTimeSeriesMetadataDTO,
  InternalId,
} from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { randomLatestDatapoint, singleTimeseries } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { TimeseriesPreview } from '../TimeseriesPreview';
import callbacks from './callbacks.md';
import customDataFetching from './custom-data-fetching.md';
import dropdown from './dropdown.md';
import fullDescription from './full.md';
import stylesDescr from './styles.md';
import valueToDisplayDescr from './value-to-display.md';

const retrieveTimeseries = async (
  id: InternalId
): Promise<GetTimeSeriesMetadataDTO[]> => {
  action('retrieveTimeseries')(id);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(singleTimeseries);
    }, 1000);
  });
};

const nameFormatter = (name?: string) => `Name: ${name}`;
const descriptionFormatter = (descr?: string) => `Descr: ${descr}`;

const retrieveLatestDatapoint = async (
  id: InternalId
): Promise<DatapointsGetDatapoint[]> => {
  action('retrieveLatestDatapoint')(id);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        randomLatestDatapoint(41852231325889, 'VAL_45-FT-92139B:X.Value'),
      ]);
    }, 100);
  });
};

const MockTimeseriesClientObject = {
  retrieve: retrieveTimeseries,
};
const MockDatapointsClientObject = {
  retrieveLatest: retrieveLatestDatapoint,
};

class MockClient extends MockCogniteClient {
  timeseries: any = MockTimeseriesClientObject;
  datapoints: any = MockDatapointsClientObject;
}

const client = new MockClient({ appId: 'storybook' });

const clientSdkDecorator = (storyFn: any) => (
  <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
);

const valueToDisplay = {
  value: 32,
  timestamp: new Date(),
} as GetDoubleDatapoint;

const formatValue = (value: number | string | undefined) => {
  return `${Math.floor(Number(value))} psi`;
};

const onToggleVisibility = (timeseries: GetTimeSeriesMetadataDTO) => {
  action('onToggleVisibility')(timeseries);
};

const onMenuClick = (key: string, timeseries: GetTimeSeriesMetadataDTO) => {
  action('On menu click')(key, timeseries);
};

const menuConfig = {
  edit: 'Edit item',
  emphasize: 'Emphasize',
  remove: 'Remove',
};

const styles = {
  wrapper: { padding: '5px', backgroundColor: '#ffe25a' },
  card: { padding: '5px', backgroundColor: '#8fffbb' },
  leftSide: { padding: '5px', backgroundColor: '#454aff' },
  rightSide: { padding: '5px', backgroundColor: '#ffeeac' },
  tagName: { padding: '5px', backgroundColor: '#944eff' },
  description: { padding: '5px', backgroundColor: '#ff7ac1' },
  value: { padding: '5px', backgroundColor: '#ff5344' },
  date: { padding: '5px', backgroundColor: '#bbff1c' },
  dropdown: {
    menu: { padding: '5px', backgroundColor: '#8883ff' },
    item: { padding: '5px', backgroundColor: '#00d8ff' },
  },
};

storiesOf('TimeseriesPreview', module)
  .addDecorator(clientSdkDecorator)
  .add(
    'Full Description',
    () => <TimeseriesPreview timeseriesId={41852231325889} />,
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('TimeseriesPreview/Examples', module)
  .addDecorator(clientSdkDecorator)
  .add(
    'Value to display',
    () => (
      <TimeseriesPreview
        timeseriesId={41852231325889}
        valueToDisplay={valueToDisplay}
        formatDisplayValue={formatValue}
        nameFormatter={nameFormatter}
        descriptionFormatter={descriptionFormatter}
      />
    ),
    {
      readme: {
        content: valueToDisplayDescr,
      },
    }
  )
  .add(
    'Custom data fetching',
    () => (
      <TimeseriesPreview
        timeseriesId={41852231325889}
        retrieveTimeseries={retrieveTimeseries}
        retrieveLatestDatapoint={retrieveLatestDatapoint}
      />
    ),
    {
      readme: {
        content: customDataFetching,
      },
    }
  )
  .add(
    'Dropdown menu',
    () => (
      <TimeseriesPreview
        timeseriesId={41852231325889}
        dropdown={{ options: menuConfig, onClick: onMenuClick }}
      />
    ),
    {
      readme: {
        content: dropdown,
      },
    }
  )
  .add(
    'Callbacks',
    () => (
      <TimeseriesPreview
        timeseriesId={41852231325889}
        onToggleVisibility={onToggleVisibility}
      />
    ),
    {
      readme: {
        content: callbacks,
      },
    }
  )
  .add(
    'Styling',
    () => (
      <TimeseriesPreview
        timeseriesId={41852231325889}
        styles={styles}
        dropdown={{ options: menuConfig, onClick: onMenuClick }}
      />
    ),
    {
      readme: {
        content: stylesDescr,
      },
    }
  );
