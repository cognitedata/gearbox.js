import {
  DatapointsGetAggregateDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import React, { FC, useState } from 'react';
import { randomData, timeseriesListV2 } from '../../../mocks';
import { MockCogniteClient, sleep } from '../../../mocks';
import { getGranularityInMS } from '../../../utils/utils';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { CSVLabelFormatter, TimeseriesDataExportProps } from '../interfaces';
import { TimeseriesDataExport } from '../TimeseriesDataExport';

const MockTimeseriesClientObject = {
  retrieve: async (): Promise<GetTimeSeriesMetadataDTO[]> => {
    sleep(1000);
    return [timeseriesListV2[0]];
  },
};
const MockDatapointsClientObject = {
  retrieve: async (
    query: DatapointsMultiQuery
  ): Promise<DatapointsGetAggregateDatapoint[]> => {
    return [
      randomData(
        (query.start as number) || Date.now() - 24 * 60 * 60 * 1000,
        (query.end as number) || Date.now(),
        100,
        getGranularityInMS(query.granularity as string)
      ),
    ];
  },
  retrieveLatest: async () => {
    return [{ datapoints: [{ timestamp: new Date() }] }];
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

export const labelFormatter: CSVLabelFormatter = (
  ts: GetTimeSeriesMetadataDTO
) => ts.name || `timeserie-${ts.id}`;

export const ComponentProps: FC<TimeseriesDataExportProps> = () => <></>;
