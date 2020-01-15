import {
  DatapointsGetAggregateDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import React, { FC, useState } from 'react';
import { randomData, timeseriesListV2 } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { getGranularityInMS } from '../../../utils/utils';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { TimeseriesDataExportProps } from '../interfaces';
import { TimeseriesDataExport } from '../TimeseriesDataExport';

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

export const TimeseriesChartExportWrapper: React.FC<
  Omit<TimeseriesDataExportProps, 'visible' | 'form'>
> = props => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  return (
    <>
      <button onClick={onOpen}>Export Chart Data</button>
      <TimeseriesDataExport visible={open} hideModal={onClose} {...props} />
    </>
  );
};

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];
export const strings = {
  cellLimitErr:
    'Oops, you rich cell limit for CSV document – {{ cellLimit }} cells, some data may be omitted',
};

export const ComponentProps: FC<TimeseriesDataExportProps> = () => <></>;
