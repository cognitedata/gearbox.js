import {
  DatapointsGetAggregateDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';
import { randomData, timeseriesListV2 } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { getGranularityInMS } from '../../../utils/utils';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import TimeseriesChartExport, {
  TimeseriesChartExportProps,
} from '../TimeseriesChartExport';
import fullDescription from './full.md';
import outOfLimit from './out-of-limit.md';

const MockTimeseriesClientObject = {
  retrieve: (): Promise<GetTimeSeriesMetadataDTO[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([timeseriesListV2[0]]);
      }, 1000); // simulate load delay
    });
  },
};
const MockDatapointsClientObject = {
  retrieve: (
    query: DatapointsMultiQuery
  ): Promise<DatapointsGetAggregateDatapoint[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const result = randomData(
          (query.start as number) || Date.now() - 24 * 60 * 60 * 1000,
          (query.end as number) || Date.now(),
          100,
          getGranularityInMS(query.granularity as string)
        );
        resolve([result]);
      });
    });
  },
};

export class MockClient extends MockCogniteClient {
  timeseries: any = MockTimeseriesClientObject;
  datapoints: any = MockDatapointsClientObject;
}

const client = new MockClient({ appId: 'storybook' });

const TimeseriesChartExportWrapper: React.FC<
  Omit<TimeseriesChartExportProps, 'visible' | 'form'>
> = props => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  return (
    <ClientSDKProvider client={client}>
      <button onClick={onOpen}>Export Chart Data</button>
      <TimeseriesChartExport visible={open} hideModal={onClose} {...props} />
    </ClientSDKProvider>
  );
};

storiesOf('TimeseriesChartExport', module).add(
  'Full Description',
  () => (
    <TimeseriesChartExportWrapper
      timeseriesIds={[{ id: 41852231325889 }, { id: 7433885982156917 }]}
      granularity={'2m'}
      defaultRange={[1567321800000, 1567408200000]}
    />
  ),
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('TimeseriesChartExport/Examples', module).add(
  'Hit Limit',
  () => (
    <TimeseriesChartExportWrapper
      timeseriesIds={[{ id: 41852231325889 }, { id: 7433885982156917 }]}
      granularity={'2s'}
      defaultRange={[1567321800000, 1567408200000]}
      cellLimit={5000}
      strings={{
        cellLimitErr:
          'Oops, you rich cell limit for CSV document – {{ cellLimit }} cells, some data may be omitted',
      }}
    />
  ),
  {
    readme: {
      content: outOfLimit,
    },
  }
);
