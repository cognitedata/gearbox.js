import {
  DatapointsGetDatapoint,
  GetDoubleDatapoint,
  GetStringDatapoint,
  GetTimeSeriesMetadataDTO,
  InternalId,
} from '@cognite/sdk';
import { Card, Dropdown, Icon, Menu } from 'antd';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import { PureObject } from '../../interfaces';

export type FetchLatestDatapointCall = (
  timeseriesId: InternalId
) => Promise<DatapointsGetDatapoint[]>;

export type FetchTimeserieCall = (
  timeseriesId: InternalId
) => Promise<GetTimeSeriesMetadataDTO[]>;

export interface TimeseriesPreviewProps {
  /**
   * Timeseries id
   */
  timeseriesId: number;
  /**
   * Rendered as a background color for the left side of the component
   */
  color?: string;
  /**
   * Defines date format to be applied on datapoint timestamp
   */
  dateFormat?: string;
  /**
   * Function, that formats timeseries name value to be displayed
   */
  nameFormatter?: (name?: string) => string;
  /**
   * Function that formats timeseries description value to be displayed
   */
  descriptionFormatter?: (description?: string) => string;
  /**
   * Refresh latest datapoint interval in ms
   */
  updateInterval?: number;
  /**
   * Datapoint to be rendered instead of latest datapoint. Pause fetching latest datapoint if provided
   */
  valueToDisplay?: GetDoubleDatapoint | GetStringDatapoint;
  /**
   * Configuration, that describes dropdown menu to be rendered
   */
  dropdown?: TimeseriesPreviewMenuConfig;
  /**
   * Function that can be used to replace embedded timeseries fetching logic
   */
  retrieveTimeseries?: FetchTimeserieCall;
  /**
   * Function that can be used to replace embedded latest datapoint fetching
   */
  retrieveLatestDatapoint?: FetchLatestDatapointCall;
  /**
   * Function that gives ability to format rendered value of latest or provided datapoint
   */
  formatDisplayValue?: (value?: string | number) => string | number;
  /**
   * Callback that triggers in case of click on visibility icon
   */
  onToggleVisibility?: (timeseries: GetTimeSeriesMetadataDTO) => void;
  /**
   * Styles, that can be provided to customize component view
   */
  styles?: TimeseriesPreviewStyles;
  /**
   * Strings, that can be customized
   */
  strings?: PureObject;
}

export interface TimeseriesPreviewStyles {
  wrapper?: React.CSSProperties;
  card?: React.CSSProperties;
  leftSide?: React.CSSProperties;
  rightSide?: React.CSSProperties;
  tagName?: React.CSSProperties;
  description?: React.CSSProperties;
  value?: React.CSSProperties;
  date?: React.CSSProperties;
  dropdown?: DropdownMenuStyles;
}

export interface TimeseriesPreviewMenuConfig {
  options: PureObject;
  onClick: (key: string, timeseries: GetTimeSeriesMetadataDTO) => void;
}

export interface DropdownMenuStyles {
  menu?: React.CSSProperties;
  item?: React.CSSProperties;
}

interface GenarateDropdownMenuProps extends TimeseriesPreviewMenuConfig {
  timeseries: GetTimeSeriesMetadataDTO;
  styles?: DropdownMenuStyles;
}

const defaultStrings = {
  noData: 'No Data',
};

const generateDropdownMenu = ({
  options,
  onClick,
  timeseries,
  styles = {},
}: GenarateDropdownMenuProps): JSX.Element => {
  const { menu = {}, item = {} } = styles;
  const items = Object.keys(options).map(key => (
    <Menu.Item key={key} onClick={() => onClick(key, timeseries)} style={item}>
      <span>{options[key]}</span>
    </Menu.Item>
  ));

  return <Menu style={{ padding: 0, borderRadius: 0, ...menu }}>{items}</Menu>;
};

const TimeseriesPreview: FC<TimeseriesPreviewProps> = ({
  timeseriesId,
  dropdown,
  onToggleVisibility,
  color,
  valueToDisplay,
  nameFormatter,
  descriptionFormatter,
  retrieveTimeseries,
  retrieveLatestDatapoint,
  updateInterval,
  dateFormat,
  formatDisplayValue,
  styles = {},
  strings = {},
}: TimeseriesPreviewProps) => {
  const {
    wrapper: wrapperStyle = {},
    card: cardStyle = {},
    leftSide: leftSideStyle = {},
    rightSide: rightSideStyle = {},
    tagName: tagNameStyle = {},
    description: descriptionStyle = {},
    value: valueStyle = {},
    date: dateStyle = {},
    dropdown: dropdownStyle = {},
  } = styles;
  const lang = { ...defaultStrings, ...strings };

  const context = useCogniteContext(Component, true);

  const [loading, setLoading] = useState<boolean>(true);
  const [timeseries, setTimeseries] = useState<GetTimeSeriesMetadataDTO>();
  const [intervalPointer, setIntervalPointer] = useState<number | undefined>();
  const [latestDatapoint, setLatestDatapoint] = useState<
    GetDoubleDatapoint | GetStringDatapoint
  >();

  const onVisibilityClick = () => {
    if (onToggleVisibility && timeseries) {
      onToggleVisibility(timeseries);
    }
  };

  const dropdownMenu =
    dropdown && timeseries ? (
      <Dropdown
        overlay={generateDropdownMenu({
          ...dropdown,
          timeseries,
          styles: dropdownStyle,
        })}
        trigger={['click']}
      >
        <ActionIcon type="ellipsis" />
      </Dropdown>
    ) : null;

  const displayValue = () => {
    const value = valueToDisplay
      ? valueToDisplay.value
      : latestDatapoint
      ? latestDatapoint.value
      : undefined;

    return formatDisplayValue ? formatDisplayValue(value) : value;
  };

  const displayDate = () => {
    const date = valueToDisplay
      ? valueToDisplay.timestamp
      : latestDatapoint
      ? latestDatapoint.timestamp
      : undefined;

    return date ? moment(date).format(dateFormat) : undefined;
  };

  useEffect(() => {
    let canceled = false;

    const fetchTimeseries = async (id: number): Promise<void> => {
      try {
        const timeseriesById = retrieveTimeseries
          ? await retrieveTimeseries({ id })
          : await context!.timeseries.retrieve([{ id }]);

        if (timeseriesById.length && !canceled) {
          setTimeseries(timeseriesById[0]);
        }
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    };

    fetchTimeseries(timeseriesId);

    return () => {
      canceled = true;
    };
  }, [timeseriesId]);

  useEffect(() => {
    let canceled = false;

    const fetchLatestDatapoint = async (id: number): Promise<void> => {
      try {
        const latest = retrieveLatestDatapoint
          ? await retrieveLatestDatapoint({ id })
          : await context!.datapoints.retrieveLatest([{ id }]);

        if (latest.length && latest[0].datapoints[0] && !canceled) {
          setLatestDatapoint(latest[0].datapoints[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    clearInterval(intervalPointer);

    if (valueToDisplay === undefined) {
      const pointer = setInterval(() => {
        if (canceled) {
          clearInterval(intervalPointer);

          return;
        }

        fetchLatestDatapoint(timeseriesId);
      }, updateInterval);

      fetchLatestDatapoint(timeseriesId);

      setIntervalPointer(pointer);
    }

    return () => {
      canceled = true;
    };
  }, [valueToDisplay, timeseriesId]);

  return (
    <Wrapper style={wrapperStyle}>
      <Card
        bordered={false}
        bodyStyle={{ padding: 0, ...cardStyle }}
        loading={loading}
      >
        {timeseries && (
          <CardBody>
            <LeftSide style={{ backgroundColor: color, ...leftSideStyle }}>
              {onToggleVisibility && (
                <ActionIcon
                  data-test-id={'visibility'}
                  type="eye"
                  onClick={onVisibilityClick}
                />
              )}
              {dropdownMenu}
            </LeftSide>
            <RightSide style={rightSideStyle}>
              <TagName style={tagNameStyle} data-test-id={'name'}>
                {nameFormatter
                  ? nameFormatter(timeseries.name)
                  : timeseries.name}
              </TagName>
              <p style={descriptionStyle} data-test-id={'description'}>
                {descriptionFormatter
                  ? descriptionFormatter(timeseries.description)
                  : timeseries.description}
              </p>
              <ValueContainer data-test-id={'value'}>
                <Value style={valueStyle}>
                  <span>{displayValue() || lang.noData}</span>
                </Value>
                <DateValue style={dateStyle}>
                  <span>{displayDate()}</span>
                </DateValue>
              </ValueContainer>
            </RightSide>
          </CardBody>
        )}
      </Card>
    </Wrapper>
  );
};

TimeseriesPreview.defaultProps = {
  color: '#6c65ee',
  updateInterval: 5000,
  dateFormat: 'DD MMM YYYY - HH:mm:ss',
};

const Component = withDefaultTheme(TimeseriesPreview);
Component.displayName = 'TimeseriesPreview';

export { TimeseriesPreview as TimeseriesPreviewWithoutTheme };
export { Component as TimeseriesPreview };

const Wrapper = styled.div`
  min-width: 300px;
  display: inline-block;

  .ant-card-loading-content {
    padding: 0 !important;
  }
`;
const CardBody = styled.div`
  display: flex;
  flex-direction: row;
`;
const LeftSide = styled.div`
  width: 40px;
  min-width: 40px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  font-size: 18px;
`;
const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  background-color: ${({ theme }) => theme.gearbox.lightGrey};
`;
const ActionIcon = styled(Icon)`
  cursor: pointer;
`;
const TagName = styled.p`
  font-size: 0.8em;
  font-weight: 600;
`;
const ValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;
const Value = styled.div`
  font-weight: 600;
  padding-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const DateValue = styled.div`
  font-size: 0.8em;
  text-align: right;
`;
