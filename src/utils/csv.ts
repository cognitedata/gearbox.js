import { Aggregate, DatapointsGetAggregateDatapoint } from '@cognite/sdk';
import { saveAs } from 'file-saver';
import moment from 'moment-timezone';
import { getGranularityInMS } from './utils';

export interface DatapointsToCSVProps {
  data: DatapointsGetAggregateDatapoint[];
  granularity: string;
  aggregate?: Aggregate;
  delimiter?: Delimiters;
  format?: string;
}

export enum Delimiters {
  Comma = ',',
  Tab = '\t',
  Semicolon = ';',
}

export function datapointsToCSV({
  data,
  granularity,
  aggregate = 'average',
  delimiter = Delimiters.Comma,
  format,
}: DatapointsToCSVProps): string {
  const ids = data.map(({ id, externalId }) => externalId || id.toString());

  const arrangedData = arrangeDatapointsByTimestamp({
    data,
    aggregate,
    granularity,
  });

  const csvStrings = generateCSVStringsArray(arrangedData, delimiter, format);

  return [['timestamp', ...ids].join(delimiter), ...csvStrings].join('\n');
}

export function downloadCSV(src: string, filename: string = 'data.csv') {
  const blob = new Blob([src], { type: 'text/csv;charset=utf-8;' });

  saveAs(blob, filename);
}

function getStartEndAndIterationsTotal(
  data: DatapointsGetAggregateDatapoint[]
): [number, number, number] {
  let startTimestamp = Infinity;
  let endTimestamp = 0;
  const iterationsTotal = data.reduce((acc, { datapoints }) => {
    if (datapoints.length) {
      const start = datapoints[0].timestamp.getTime();
      const end = datapoints[datapoints.length - 1].timestamp.getTime();

      if (startTimestamp > start) {
        startTimestamp = start;
      }
      if (endTimestamp < end) {
        endTimestamp = end;
      }
    }

    return datapoints.length + acc;
  }, 0);

  return [startTimestamp, endTimestamp, iterationsTotal];
}

export function arrangeDatapointsByTimestamp({
  data,
  aggregate,
  granularity: granularityString,
}: Omit<DatapointsToCSVProps, 'delimiter'>): (number | string)[][] {
  if (!granularityString) {
    return [];
  }

  const arrangedData = [];
  const granularity = getGranularityInMS(granularityString);

  const pointers = Array(data.length).fill(0);
  const [
    startTimestamp,
    endTimestamp,
    iterationsTotal,
  ] = getStartEndAndIterationsTotal(data);

  let iterationLeft = iterationsTotal;
  let currentTimestamp = startTimestamp;

  while (iterationLeft > 0 && currentTimestamp <= endTimestamp) {
    const values: string[] = [];

    data.forEach(({ datapoints }, index) => {
      const dpPointer = pointers[index];
      const datapoint = datapoints[dpPointer];

      if (datapoint) {
        const timestamp = datapoints[dpPointer].timestamp.getTime();

        if (timestamp === currentTimestamp) {
          const value = datapoints[dpPointer][aggregate!];
          values[index] = value!.toString();

          pointers[index]++;
          iterationLeft--;
        }
      }
    });

    if (values.length) {
      arrangedData.push([currentTimestamp, ...values]);
    }

    currentTimestamp += granularity;
  }

  return arrangedData;
}

function generateCSVStringsArray(
  arrangedData: (string | number)[][],
  delimiter: Delimiters,
  format?: string
): string[] {
  return arrangedData.map(timestampRow => {
    const timestamp = timestampRow.shift();
    const pointer = format ? moment(timestamp).format(format) : timestamp;

    return [pointer!.toString(), ...timestampRow].join(delimiter);
  });
}
