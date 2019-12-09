import { CogniteEvent } from '@cognite/sdk';
import React from 'react';
import { AssetEventsPanelStyles } from '../../../interfaces';
import { fakeEvents, sleep } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';

class CogniteClient extends MockCogniteClient {
  events: any = {
    list: () => ({
      autoPagingToArray: async () => {
        await sleep(1000);
        return fakeEvents;
      },
    }),
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const customColumns = [
  {
    title: 'Name',
    dataIndex: 'typeAndSubtype',
    key: 'typeAndSubtype',
  },
  {
    title: 'Custom Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'From',
    dataIndex: 'start',
    key: 'start',
  },
  {
    title: 'To',
    dataIndex: 'end',
    key: 'end',
  },
];

export const customStyle: AssetEventsPanelStyles = {
  table: { border: '1px solid red' },
  tableRow: { borderBottom: '2px solid #999' },
  tableCell: { backgroundColor: '#DDD' },
};

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const handleAssetEventsLoaded = (events: CogniteEvent[]) =>
  console.log(events);
