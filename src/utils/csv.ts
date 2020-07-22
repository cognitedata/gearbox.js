// Copyright 2020 Cognite AS
import { Aggregate, DatapointAggregates, Timeseries } from '@cognite/sdk';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { getGranularityInMS } from './utils';

export type LabelFormatter = (timeseries: Timeseries) => string;

export interface DatapointsToCSVProps {
  data: DatapointAggregates[];
  granularity: string;
  aggregate?: Aggregate;
  delimiter?: Delimiters;
  format?: string;
  formatLabels?: LabelFormatterConfig;
}

export interface LabelFormatterConfig {
  timeseries: Timeseries[];
  labelFormatter: LabelFormatter;
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
  formatLabels,
}: DatapointsToCSVProps): string {
  const labels = data.map(({ id, externalId }) => {
    const idString = externalId || id.toString();

    if (!formatLabels) {
      return idString;
    }

    const { timeseries, labelFormatter } = formatLabels;

    const timeseriesById = timeseries.find(
      ({ id: tid, externalId: tExternalId }) =>
        tid === id || tExternalId === externalId
    );

    return timeseriesById ? labelFormatter(timeseriesById) : idString;
  });

  const arrangedData = arrangeDatapointsByTimestamp({
    data,
    aggregate,
    granularity,
  });

  const csvStrings = generateCSVStringsArray(arrangedData, delimiter, format);

  return [['timestamp', ...labels].join(delimiter), ...csvStrings].join('\r\n');
}

export function downloadCSV(src: string, filename: string = 'data.csv') {
  const blob = new Blob([src], { type: 'text/csv;charset=utf-8;' });

  saveAs(blob, filename);
}

function getStartEndAndIterationsTotal(
  data: DatapointAggregates[]
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
}: Omit<DatapointsToCSVProps, 'delimiter' | 'timeseries'>): (
  | number
  | string)[][] {
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
