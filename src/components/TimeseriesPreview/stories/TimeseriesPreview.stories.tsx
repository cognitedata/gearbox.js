import { CogniteClient, GetDoubleDatapoint } from '@cognite/sdk';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { TimeseriesPreview } from '../TimeseriesPreview';

const client = new CogniteClient({ appId: 'storybook' });

client.loginWithApiKey({
  project: 'publicdata',
  apiKey: 'NjkzYzNjZGItNDA2MC00YTJlLWI3MDItNjUxMmEwZDJmMTk1',
});

const clientSdkDecorator = (storyFn: any) => (
  <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
);

storiesOf('TimeseriesPreview', module)
  .addDecorator(clientSdkDecorator)
  .add(
    'Full Description',
    () => (
      <TimeseriesPreview
        timeseriesId={41852231325889}
        valueToDisplay={
          { value: 32, timestamp: new Date() } as GetDoubleDatapoint}
      />
    ),
    {}
  );
