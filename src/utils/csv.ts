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

function getStartTimestampAndIterationsTotal(
  data: DatapointsGetAggregateDatapoint[]
): [number, number] {
  let startTimestamp = Infinity;
  const iterationsTotal = data.reduce((acc, { datapoints }) => {
    if (datapoints.length) {
      const timestamp = datapoints[0].timestamp.getTime();

      if (startTimestamp > timestamp) {
        startTimestamp = timestamp;
      }
    }

    return datapoints.length + acc;
  }, 0);

  return [startTimestamp, iterationsTotal];
}

function arrangeDatapointsByTimestamp({
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
  const [startTimestamp, iterationsTotal] = getStartTimestampAndIterationsTotal(
    data
  );

  let iterationLeft = iterationsTotal;
  let currentTimestamp = startTimestamp;

  for (let iteration = 0; iteration <= iterationsTotal; iteration++) {
    let valuesGet = 0;
    const values: string[] = [];

    data.forEach(({ datapoints }, index) => {
      const dpPointer = pointers[index];
      const datapoint = datapoints[dpPointer];

      if (datapoint) {
        const timestamp = datapoints[dpPointer].timestamp.getTime();

        if (timestamp === currentTimestamp) {
          const value = datapoints[dpPointer][aggregate!];

          values.push(value!.toString());
          valuesGet++;
          pointers[index]++;
          iterationLeft--;

          return;
        }
      }

      values.push('');
    });

    iteration++;

    if (valuesGet) {
      arrangedData.push([currentTimestamp, ...values]);
    }

    currentTimestamp += granularity;
    iterationLeft -= valuesGet;

    if (iterationLeft <= 0) {
      break;
    }
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
