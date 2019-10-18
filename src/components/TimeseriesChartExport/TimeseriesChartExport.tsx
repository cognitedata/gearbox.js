import { Aggregate, DatapointsMultiQuery, InternalId } from '@cognite/sdk';
import { TimeSeries } from '@cognite/sdk/dist/src/resources/classes/timeSeries';
import { TimeSeriesList } from '@cognite/sdk/dist/src/resources/classes/timeSeriesList';
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
} from 'antd';
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { FormComponentProps } from 'antd/lib/form';
import { ColProps } from 'antd/lib/grid';
import moment, { Moment } from 'moment-timezone';
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import { AnyIfEmpty, PureObject } from '../../interfaces';
import { defaultTheme } from '../../theme/defaultTheme';
import { datapointsToCSV, Delimiters, downloadCSV } from '../../utils/csv';
import { getGranularityInMS } from '../../utils/utils';
import { ComplexString } from '../common/ComplexString/ComplexString';

export type FetchCSVCall = (
  request: DatapointsMultiQuery,
  opts: CsvParseOptions
) => Promise<string>;

export type FetchTimeseriesCall = (
  ids: InternalId[]
) => Promise<TimeSeriesList>;

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

export interface ChartExportFormFields {
  range: Moment[];
  granularity: string;
  delimiter: Delimiters;
  readableDate: boolean;
}

export interface TimeseriesChartExportProps extends FormComponentProps {
  timeseriesIds: InternalId[];
  granularity: string;
  defaultRange: number[];
  visible: boolean;
  modalWidth?: number;
  cellLimit?: number;
  downloadAsSvg?: () => void;
  fetchCSV?: FetchCSVCall;
  hideModal?: () => void;
  retrieveTimeseries?: FetchTimeseriesCall;
  onError?: (err: any) => void;
  onSuccess?: () => void;
  formItemLayout?: FormItemLayout;
  theme?: AnyIfEmpty<{}>;
  strings?: PureObject;
}

const defaultStrings: PureObject = {
  title: 'Export chart data',
  labelRange: 'Range',
  labelGranularity: 'Label Granularity',
  labelGranularityHelp: 'Example inputs: 15s, 1m, 5h, 2d',
  formatTimestamp: 'Format timestamp?',
  formatTimestampHelp: 'e.g. 2018-04-02 12:20:20',
  delimiterLabel: 'Select delimiter',
  delimiterHelp: 'The character that will separate your data fields',
  csvDownload: 'Download as CSV',
  csvDownloadInProgress: 'Download as CSV',
  closeBtn: 'Close',
  imageDownloadLabel: 'Image download',
  imageDownloadBtn: 'Download as SVG',
  cellLimitErr:
    'You hit the limit of {{ cellLimit }} datapoints - some data may be omitted',
};

// TODO: Check tree shacking for TimeseriesChartExport component
const { RangePicker } = DatePicker;
const CELL_LIMIT = 10000;
const formatData = 'YYYY-MM-DD HH:mm:ss';
const formItemLayoutDefault: FormItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const isGreaterThenLimit = (
  limit: number,
  start: number,
  end: number,
  granularity: number,
  seriesNumber: number
): boolean => {
  if (!start || !end || !granularity) {
    return false;
  }

  const requestedNumberOfPoints = ((end - start) / granularity) * seriesNumber;

  return requestedNumberOfPoints > limit;
};

// tslint:disable-next-line:no-big-function
const TimeseriesChartExport = (props: TimeseriesChartExportProps) => {
  const {
    form,
    form: { getFieldDecorator },
    formItemLayout = formItemLayoutDefault,
    timeseriesIds,
    visible,
    defaultRange,
    granularity,
    modalWidth = 600,
    cellLimit = 10000,
    downloadAsSvg,
    hideModal,
    fetchCSV,
    retrieveTimeseries,
    onError,
    onSuccess,
    strings = {},
  } = props;
  const context = useContext(ClientSDKContext);
  const [limit, setLimit] = useState(cellLimit);
  const [limitHit, setLimitHit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [series, setSeries]: [TimeSeries[], any] = useState([]);
  const lang = { ...defaultStrings, ...strings };
  const {
    title,
    labelRange,
    cellLimitErr,
    labelGranularity,
    labelGranularityHelp,
    formatTimestamp,
    formatTimestampHelp,
    delimiterLabel,
    delimiterHelp,
    csvDownload,
    csvDownloadInProgress,
    closeBtn,
    imageDownloadLabel,
    imageDownloadBtn,
  } = lang;

  const fetchCSVCall: FetchCSVCall = async (
    request,
    { aggregate, delimiter, readableDate, granularity: granularityString }
  ) => {
    const data = await context!.datapoints.retrieve(request);
    const format = readableDate ? formatData : '';

    return datapointsToCSV({
      data,
      aggregate,
      delimiter,
      format,
      granularity: granularityString,
    });
  };

  const checkLimitOnGranularityChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    const [start, end] = form.getFieldValue('range');
    const seriesNumber = timeseriesIds.length;
    const granularityString = event.currentTarget.value;
    const granularityValue = getGranularityInMS(granularityString);

    setLimitHit(
      isGreaterThenLimit(limit, start, end, granularityValue, seriesNumber)
    );
  };

  const checkLimitOnRangeChange = (range: RangePickerValue) => {
    const granularityString = form.getFieldValue('granularity');
    const seriesNumber = timeseriesIds.length;
    let start = 0;
    let end = 0;
    const granularityValue = getGranularityInMS(granularityString);

    if (range[0] && range[1]) {
      start = +range[0];
      end = +range[1];
    }

    setLimitHit(
      isGreaterThenLimit(limit, start, end, granularityValue, seriesNumber)
    );
  };

  const fetchTimeseries = async () => {
    const fetchTimeseriesCall =
      retrieveTimeseries || context!.timeseries.retrieve;

    setLoading(true);

    try {
      const timeseriesList = await fetchTimeseriesCall(timeseriesIds);

      setSeries(timeseriesList);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (onError) {
        onError(error);
      }
    }
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const limitPerSerie = Math.floor(limit / series.length);

    form.validateFields(async (_, values) => {
      const {
        range,
        granularity: granularityVal,
        delimiter,
        readableDate,
      }: ChartExportFormFields = values;
      const aggregate = 'average';
      const body: DatapointsMultiQuery = {
        items: series.map(({ id }) => ({
          id,
          aggregates: [aggregate],
        })),
        start: +range[0],
        end: +range[1],
        limit: limitPerSerie,
        granularity: granularityVal,
      };
      const opts: CsvParseOptions = {
        aggregate,
        delimiter,
        readableDate,
        granularity: granularityVal,
      };

      setLoading(true);

      try {
        const csvString = fetchCSV
          ? await fetchCSV(body, opts)
          : await fetchCSVCall(body, opts);

        setLoading(false);

        if (onSuccess) {
          onSuccess();
        }

        downloadCSV(csvString);
      } catch (e) {
        setLoading(false);

        if (onError) {
          onError(e);
        }
      }
    });
  };

  useEffect(() => {
    if (cellLimit > CELL_LIMIT) {
      setLimit(CELL_LIMIT);
    }
  }, [cellLimit]);

  useEffect(() => {
    const { range, granularity: granularityString } = form.getFieldsValue();
    const start = range[0] ? +range[0] : 0;
    const end = range[1] ? +range[1] : 0;
    const granularityValue = getGranularityInMS(granularityString);
    const seriesNumber = timeseriesIds.length;

    setLimitHit(
      isGreaterThenLimit(limit, start, end, granularityValue, seriesNumber)
    );
  }, []);

  useEffect(() => {
    if (!visible || !timeseriesIds.length) {
      return;
    }

    fetchTimeseries();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={title}
      width={modalWidth}
      footer={null}
      onCancel={hideModal}
    >
      <Form data-test-id="form" onSubmit={onSubmit}>
        <Form.Item {...formItemLayout} label={labelRange}>
          {getFieldDecorator('range', {
            initialValue: [moment(defaultRange[0]), moment(defaultRange[1])],
            rules: [{ required: true }],
          })(
            <RangePicker
              onChange={checkLimitOnRangeChange}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={labelGranularity}
          help={labelGranularityHelp}
        >
          {getFieldDecorator('granularity', {
            rules: [{ required: true }],
            initialValue: granularity,
          })(
            <Input
              data-test-id="granularity"
              onChange={checkLimitOnGranularityChange}
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={formatTimestamp}
          help={formatTimestampHelp}
        >
          {getFieldDecorator('readableDate', {
            valuePropName: 'checked',
          })(<Checkbox />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={delimiterLabel}
          help={delimiterHelp}
        >
          {getFieldDecorator('delimiter', {
            initialValue: ',',
            rules: [{ required: true }],
          })(
            <Radio.Group>
              {Object.values(Delimiters).map(delimiter => (
                <Radio.Button key={delimiter} value={delimiter}>
                  {delimiter === Delimiters.Tab ? 'tab' : delimiter}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ sm: { span: 16, offset: 8 } }}>
          <Button
            data-test-id="submit"
            type="primary"
            htmlType="submit"
            disabled={loading}
          >
            {loading ? csvDownloadInProgress : csvDownload}
          </Button>
          <Button
            type="danger"
            onClick={hideModal}
            style={{ marginLeft: '10px' }}
          >
            {closeBtn}
          </Button>
          {limitHit && (
            <Alert
              data-test-id="alert"
              style={{ marginTop: 8 }}
              type="error"
              message={
                <ComplexString
                  input={cellLimitErr as string}
                  cellLimit={limit}
                />
              }
            />
          )}
        </Form.Item>
        {downloadAsSvg && (
          <Form.Item {...formItemLayout} label={imageDownloadLabel}>
            <Button onClick={downloadAsSvg}>{imageDownloadBtn}</Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

const Wrapper = Form.create<TimeseriesChartExportProps>({
  name: 'TimeseriesChartExport',
})(TimeseriesChartExport);

Wrapper.defaultProps = {
  theme: defaultTheme,
};

export default withDefaultTheme(Wrapper);
