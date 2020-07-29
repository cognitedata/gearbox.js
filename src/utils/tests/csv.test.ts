// Copyright 2020 Cognite AS
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fileSaver from 'file-saver';
import moment from 'moment';
import { csvExportData } from '../../mocks';
import {
  arrangeDatapointsByTimestamp,
  datapointsToCSV,
  Delimiters,
  downloadCSV,
} from '../csv';

configure({ adapter: new Adapter() });

const timeseriesId = 123;
const formatDate = 'YYYY-MM-DD HH:mm:ss';
const currentDate = new Date();
const formatedDate = moment(currentDate.getTime()).format(formatDate);
const timeseries: GetTimeSeriesMetadataDTO[] = [
  {
    id: timeseriesId,
    name: `Timeseries${timeseriesId}`,
    isString: false,
    isStep: false,
    description: 'Test Timeseries',
    createdTime: new Date(),
    lastUpdatedTime: new Date(),
  },
];
const labelFormatter = (ts: GetTimeSeriesMetadataDTO) => {
  return ts.name!;
};
const data = [
  {
    id: timeseriesId,
    datapoints: [
      {
        timestamp: currentDate,
        average: 1,
        max: 2,
      },
    ],
  },
];
const csvString = `timestamp,123\r\n${currentDate.getTime()},1`;
const csvStringFormated = `timestamp${Delimiters.Semicolon}123\r\n${formatedDate}${Delimiters.Semicolon}1`;
const csvStringFormattedLabel = `timestamp${Delimiters.Semicolon}Timeseries${timeseriesId}\r\n${formatedDate}${Delimiters.Semicolon}1`;
const csvStringMax = `timestamp,123\r\n${currentDate.getTime()},2`;
const emptyCsvString = `timestamp,123`;
const saveAs = jest.spyOn(fileSaver, 'saveAs').mockImplementation(() => null);

afterEach(() => {
  jest.clearAllMocks();
});

describe('csv', () => {
  describe('datapointsToCSV', () => {
    it('should return empty string with header only', () => {
      const result = datapointsToCSV({
        data,
        granularity: '',
      });

      expect(result).toEqual(emptyCsvString);
    });
    it('should return proper string', () => {
      const result = datapointsToCSV({
        data,
        granularity: '2s',
        aggregate: 'max',
      });

      expect(result).toEqual(csvStringMax);
    });
    it('should return string with formatted timestamp value', () => {
      const result = datapointsToCSV({
        data,
        granularity: '2s',
        delimiter: Delimiters.Semicolon,
        format: formatDate,
      });

      expect(result).toEqual(csvStringFormated);
    });
    it('should return string with formatted column label', () => {
      const result = datapointsToCSV({
        data,
        granularity: '2s',
        delimiter: Delimiters.Semicolon,
        format: formatDate,
        formatLabels: {
          timeseries,
          labelFormatter,
        },
      });
      expect(result).toEqual(csvStringFormattedLabel);
    });
    it('should use default props', () => {
      const result = datapointsToCSV({
        data,
        granularity: '2s',
      });

      expect(result).toEqual(csvString);
    });
    it('should run through all provided datapoints', () => {
      let datapointsTotal = 0;
      let usedDatapoints = 0;
      const aggregate = 'average';
      const granularity = '2s';
      const result = arrangeDatapointsByTimestamp({
        data: csvExportData,
        aggregate,
        granularity,
      });

      csvExportData.forEach(tid => {
        const { datapoints } = tid;

        datapointsTotal += datapoints.length;
      });

      result.forEach(line => {
        const values = line.slice(1);
        values.forEach(value => {
          if (value) {
            usedDatapoints++;
          }
        });
      });

      expect(usedDatapoints === datapointsTotal).toBeTruthy();
    });
  });

  describe('downloadCSV', () => {
    it('should use default filename', () => {
      downloadCSV(csvString);

      expect(saveAs.mock.calls[0][0] instanceof Blob).toBeTruthy();
      expect(saveAs.mock.calls[0][1]).toEqual('data.csv');
    });
  });
});
