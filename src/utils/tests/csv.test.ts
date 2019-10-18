import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fileSaver from 'file-saver';
import moment from 'moment-timezone';
import { datapointsToCSV, Delimiters, downloadCSV } from '../csv';

configure({ adapter: new Adapter() });

const formatDate = 'YYYY-MM-DD HH:mm:ss';
const timestamp = new Date();
const formatedDate = moment(timestamp.getTime()).format(formatDate);
const data = [
  {
    id: 123,
    datapoints: [
      {
        timestamp,
        average: 1,
        max: 2,
      },
    ],
  },
];
const csvString = `timestamp,123\n${timestamp.getTime()},1`;
const csvStringFormated = `timestamp${Delimiters.Semicolon}123\n${formatedDate}${Delimiters.Semicolon}1`;
const csvStringMax = `timestamp,123\n${timestamp.getTime()},2`;
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
    it('should use default props', () => {
      const result = datapointsToCSV({
        data,
        granularity: '2s',
      });

      expect(result).toEqual(csvString);
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
