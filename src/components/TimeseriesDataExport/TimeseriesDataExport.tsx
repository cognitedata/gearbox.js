import {
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
  IdEither,
} from '@cognite/sdk';
import { Button, Checkbox, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { chunk, isFunction, range } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc';
import { defaultTheme } from '../../theme/defaultTheme';
import { datapointsToCSV, Delimiters, downloadCSV } from '../../utils/csv';
import { getGranularityInMS } from '../../utils/utils';
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

// TODO: Check tree shaking for TimeseriesDataExport component
const { RangePicker } = DatePicker;
const CELL_LIMIT = 10000;
const formatData = 'YYYY-MM-DD HH:mm:ss';
const formItemLayoutDefault: FormItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
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
    timeseriesIds = [],
    timeseriesExternalIds = [],
    visible,
    defaultTimeRange: [startTimestamp, endTimestamp],
    granularity,
    modalWidth = 600,
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
  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState<GetTimeSeriesMetadataDTO[]>([]);
  const lang = useMemo(
    () => ({
      ...defaultStrings,
      ...(isFunction(strings) ? strings(defaultStrings) : strings),
    }),
    [strings]
  );

  const seriesNumber = timeseriesIds.length + timeseriesExternalIds.length;

  const {
    title,
    labelRange,
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

  const getLimits = async (request: DatapointsMultiQuery) => {
    let { start = 0, end = 0 } = request;

    const project = context!.project || '';
    const url = `/api/v1/projects/${project}/timeseries/data/latest`;
    // @ts-ignore
    const items = request.items.map(({ id }) => ({ id }));

    const endResults = await context!.post<{ items: any[] }>(url, {
      data: { items },
    });
    end = Math.min(
      ...endResults.data.items.map(item => +item.datapoints[0].timestamp, end)
    );

    const getFirstDatapointRequest = {
      ...request,
      start,
      end,
      limit: CELL_LIMIT,
    };

    const startResult = await context!.datapoints.retrieve(
      getFirstDatapointRequest
    );
    start = Math.max(
      // @ts-ignore
      ...startResult.map(({ datapoints }) => +datapoints[0].timestamp),
      // @ts-ignore
      start
    );

    return { start, end };
  };

  const fetchDataPoints = async (request: DatapointsMultiQuery) => {
    const { start = 0, end = 0 } = await getLimits(request);
    const numericGranularity = getGranularityInMS(granularity);
    const msPerRequest =
      (numericGranularity * CELL_LIMIT) / timeseriesIds.length;

    const limits = range(+start, +end, msPerRequest);
    const lastLimit =
      limits.length % 2 === 0 ? [+end - msPerRequest, +end] : [+end];
    const ranges = chunk([...limits, ...lastLimit], 2);
    const limit = CELL_LIMIT / timeseriesIds.length;

    const requests = ranges
      .map(([start, end]) => ({ ...request, start, end, limit }))
      .map(request => context!.datapoints.retrieve(request));

    return (await Promise.all(requests)).flat();
  };

  const fetchCSVCall: FetchCSVCall = async (
    request,
    { aggregate, delimiter, readableDate, granularity: granularityString }
  ) => {
    const data = await fetchDataPoints(request);
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

  const fetchTimeseries = async () => {
    const fetchTimeseriesCall =
      retrieveTimeseries || context!.timeseries.retrieve;

    const timeserieIdsObj: IdEither[] = [
      ...timeseriesIds.map(id => ({ id })),
      ...timeseriesExternalIds.map(externalId => ({
        externalId,
      })),
    ];

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
    if (!visible || !seriesNumber) {
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
          })(<Input data-test-id="granularity" />)}
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
