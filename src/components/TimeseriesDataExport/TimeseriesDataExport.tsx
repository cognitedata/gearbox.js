import {
  DatapointsMultiQuery,
  DatapointsQueryId,
  GetTimeSeriesMetadataDTO,
  IdEither,
} from '@cognite/sdk';
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDatapoint,
} from '@cognite/sdk/dist/src/types/types';
import { Button, Checkbox, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { chunk, isFunction, range } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc';
import { TimeRange } from '../../interfaces';
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
const formatData = 'YYYY-MM-DD_HH:mm:ss';
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

  /**
   * Correct request time frame boundaries to reduce number of redundant chunked calls.
   * Redundant calls appears when provided time range doesn't have datapoints.
   * @param request - datapoints request
   * @return Promise<timerange> - corrected timerange
   */
  const getLimits = async (
    request: DatapointsMultiQuery
  ): Promise<TimeRange<number>> => {
    let { start = 0, end = 0 } = request;
    const items = request.items.map(item => ({
      id: (item as DatapointsQueryId).id,
    }));
    const endResults = await context!.datapoints.retrieveLatest(items);

    end = Math.min(
      Math.max(
        ...endResults.map(({ datapoints: [item] }) => item.timestamp.getTime())
      ),
      Number(end)
    );

    const startResults: (
      | DatapointsGetAggregateDatapoint
      | DatapointsGetDatapoint)[] = await context!.datapoints.retrieve({
      ...request,
      start,
      end,
      limit: 1,
    });
    start = Math.max(
      Math.min(
        ...startResults.map(({ datapoints: [item] }) =>
          item.timestamp.getTime()
        )
      ),
      Number(start)
    );

    return { start, end };
  };

  const fetchDataPoints = async (
    request: DatapointsMultiQuery
  ): Promise<DatapointsGetAggregateDatapoint[]> => {
    const { start = 0, end = 0 } = await getLimits(request);
    const numericGranularity = getGranularityInMS(granularity);
    const msPerRequest =
      (numericGranularity * CELL_LIMIT) / timeseriesIds.length;

    const limits = range(start, end, msPerRequest);
    const lastLimit =
      limits.length % 2 === 0 ? [end - msPerRequest, end] : [end];
    const ranges = chunk([...limits, ...lastLimit], 2);
    const limit = CELL_LIMIT / timeseriesIds.length;

    const requests = ranges
      .map(([rangeStart, rangeEnd]) => ({
        ...request,
        start: rangeStart,
        end: rangeEnd,
        limit,
      }))
      .map(params => context!.datapoints.retrieve(params));

    const res: DatapointsGetAggregateDatapoint[][] = await Promise.all(
      requests
    );

    return res.reduce((acc, current) => {
      return acc.map((s, i) => {
        s.datapoints = [...s.datapoints, ...current[i].datapoints];
        return s;
      });
    });
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
        range: [start, end],
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
        start: start.valueOf(),
        end: end.valueOf(),
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
