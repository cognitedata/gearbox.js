import {
  Aggregate,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
  InternalId,
} from '@cognite/sdk';
import { ColProps } from 'antd/lib/grid';
import { Moment } from 'moment';
import { AnyIfEmpty, PureObject } from '../../interfaces';
import { Delimiters, LabelFormatter } from '../../utils/csv';

export type FetchCSVCall = (
  request: DatapointsMultiQuery,
  opts: CsvParseOptions
) => Promise<string>;

export type FetchTimeseriesCall = (
  ids: InternalId[]
) => Promise<GetTimeSeriesMetadataDTO[]>;
export type CSVLabelFormatter = LabelFormatter;

export interface CsvParseOptions {
  aggregate: Aggregate;
  delimiter: Delimiters;
  readableDate: boolean;
  granularity: string;
}

export interface FormItemLayout {
  labelCol: ColProps;
  wrapperCol: ColProps;
}

export interface TimeseriesDataExportFormFields {
  range: Moment[];
  granularity: string;
  delimiter: Delimiters;
  readableDate: boolean;
}

export interface TimeseriesDataExportProps {
  /**
   * Array of timeserie ids
   */
  timeseriesIds: number[];
  /**
   * String, that represents initial granularity (ex. 2m, 15s, 1h) to be displayed in form
   */
  granularity: string;
  /**
   * Array with start - end timestamp values for initial time range
   */
  defaultTimeRange: number[];
  /**
   * Flag that shows/hides modal with form
   */
  visible: boolean;
  /**
   * Flag that shows/hides modal with form
   */
  modalWidth?: number;
  /**
   * Limit of cells for generated CSV documents, can't be greater then 10000
   */
  cellLimit?: number;
  /**
   * Function, that triggers on Download SVG button click. Button appears if this function is defined
   */
  downloadAsSvg?: () => void;
  /**
   * Async function that return CSV-kind string that will be a source for CSV file
   */
  fetchCSV?: FetchCSVCall;
  /**
   * Callback that handles modal close action
   */
  hideModal?: () => void;
  /**
   * Async function that fetches data about timeseries
   */
  retrieveTimeseries?: FetchTimeseriesCall;
  /**
   * Callback that triggers in case of API call errors
   */
  onError?: (err: any) => void;
  /**
   * Callback that triggers after success CSV file generation
   */
  onSuccess?: () => void;
  /**
   * Object that configures form layout based on antd rules for label and wrapper
   */
  formItemLayout?: FormItemLayout;
  /**
   *  Function that format columns labels for csv data file
   */
  labelFormatter?: CSVLabelFormatter;
  /**
   * Strings, that can be customized
   */
  strings?: PureObject;
  /**
   * @ignore
   */
  theme?: AnyIfEmpty<{}>;
}
