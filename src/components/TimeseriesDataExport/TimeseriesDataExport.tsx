import { DatapointsMultiQuery, GetTimeSeriesMetadataDTO } from '@cognite/sdk';
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
import isFunction from 'lodash/isFunction';
import moment from 'moment';
import React, { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc';
import { defaultTheme } from '../../theme/defaultTheme';
import { datapointsToCSV, Delimiters, downloadCSV } from '../../utils/csv';
import { getGranularityInMS } from '../../utils/utils';
import { ComplexString } from '../common/ComplexString/ComplexString';
import { defaultStrings } from './constants';
import {
  CsvParseOptions,
  FetchCSVCall,
  FormItemLayout,
  TimeseriesDataExportFormFields,
  TimeseriesDataExportProps,
} from './interfaces';

type TimeseriesDataExportFormProps = TimeseriesDataExportProps &
  FormComponentProps;

// TODO: Check tree shacking for TimeseriesDataExport component
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
const TimeseriesDataExportFC: FC<TimeseriesDataExportFormProps> = (
  props: TimeseriesDataExportFormProps
  // tslint:disable-next-line:no-big-function
) => {
  const {
    form,
    form: { getFieldDecorator },
    formItemLayout = formItemLayoutDefault,
    timeseriesIds,
    visible,
    defaultTimeRange: [startTimestamp, endTimestamp],
    granularity,
    modalWidth = 600,
    cellLimit = 10000,
    downloadAsSvg,
    hideModal,
    fetchCSV,
    retrieveTimeseries,
    onError,
    onSuccess,
    strings = defaultStrings,
    labelFormatter,
  } = props;
  const context = useCogniteContext(Component, true);
  const [limit, setLimit] = useState(cellLimit);
  const [limitHit, setLimitHit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState<GetTimeSeriesMetadataDTO[]>([]);
  const lang = useMemo(
    () => ({
      ...defaultStrings,
      ...(isFunction(strings) ? strings(defaultStrings) : strings),
    }),
    [strings]
  );

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
    const formatLabels = labelFormatter
      ? {
          labelFormatter,
          timeseries: series,
        }
      : undefined;

    return datapointsToCSV({
      data,
      aggregate,
      delimiter,
      format,
      formatLabels,
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
    const timeserieIdsObj = timeseriesIds.map(id => ({ id }));

    setLoading(true);

    try {
      const timeseriesList = await fetchTimeseriesCall(timeserieIdsObj);

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
      }: TimeseriesDataExportFormFields = values;
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
            initialValue: [moment(startTimestamp), moment(endTimestamp)],
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

const Wrapper: React.ComponentType<TimeseriesDataExportProps> = Form.create<
  TimeseriesDataExportFormProps
>({
  name: 'TimeseriesDataExport',
})(TimeseriesDataExportFC);

Wrapper.defaultProps = {
  theme: defaultTheme,
};

const Component = withDefaultTheme(Wrapper);
Component.displayName = 'TimeseriesDataExport';

export { Component as TimeseriesDataExport };
