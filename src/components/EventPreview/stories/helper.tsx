import { CogniteEvent, IdEither } from '@cognite/sdk';
import React from 'react';
import { fakeEvents, MockCogniteClient, sleep } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { EventPreviewStyles } from '../interfaces';

class CogniteClient extends MockCogniteClient {
  events: any = {
    retrieve: async (ids: IdEither[]): Promise<CogniteEvent[]> => {
      await sleep(1000);
      // @ts-ignore
      return [fakeEvents.find(e => e.id === ids[0].id)];
    },
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const onShowDetails = (e: CogniteEvent) => {
  console.log('onShowDetails', e);
};

export const strings = {
  start: 'From',
  end: 'To',
  details: 'More Details',
  metadataSummary: 'Contains {{count}} more',
};

export const customStyle: EventPreviewStyles = {
  wrapper: { backgroundColor: 'pink' },
  eventType: { color: 'green' },
  description: { color: 'yellow' },
  button: { color: 'black', backgroundColor: 'magenta' },
  times: { backgroundColor: 'purple' },
  metadata: { backgroundColor: 'lightblue' },
};

export const exampleTheme = {
  gearbox: {
    containerColor: 'AliceBlue',
    containerBorderColor: 'Aqua',
    textColorAccent: 'Coral',
    textColorSecondary: 'ForestGreen',
  },
};
