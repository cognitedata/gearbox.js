// Copyright 2020 Cognite AS
import { GetTimeSeriesMetadataDTO, InternalId } from '@cognite/sdk';
import React from 'react';
import { randomLatestDatapoint, singleTimeseries, sleep } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';

export const retrieveTimeseries = async (id: InternalId) => {
  console.log('retrieveTimeseries', id);
  await sleep(1000);
  return singleTimeseries;
};

export const nameFormatter = (name?: string) => `Name: ${name}`;

export const descriptionFormatter = (descr?: string) => `Descr: ${descr}`;

export const retrieveLatestDatapoint = async (id: InternalId) => {
  console.log('retrieveLatestDatapoint', id);
  await sleep(100);
  return [randomLatestDatapoint(41852231325889, 'VAL_45-FT-92139B:X.Value')];
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

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const valToDisplay = {
  value: 32,
  timestamp: new Date(),
};

export const formatValue = (value: number | string | undefined) => {
  return `${Math.floor(Number(value))} psi`;
};

export const onToggleVisibility = (timeseries: GetTimeSeriesMetadataDTO) => {
  console.log('onToggleVisibility', timeseries);
};

export const onMenuClick = (
  key: string,
  timeseries: GetTimeSeriesMetadataDTO
) => {
  console.log('On menu click', key, timeseries);
};

export const menuConfig = {
  edit: 'Edit item',
  emphasize: 'Emphasize',
  remove: 'Remove',
};

export const styles = {
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

export const dropdown = { options: menuConfig, onClick: onMenuClick };
