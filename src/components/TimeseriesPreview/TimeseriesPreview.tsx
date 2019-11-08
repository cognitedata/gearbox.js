import {
  DatapointsGetDatapoint,
  GetDoubleDatapoint,
  GetStringDatapoint,
  GetTimeSeriesMetadataDTO,
  InternalId,
} from '@cognite/sdk';
import { Card, Dropdown, Icon, Menu } from 'antd';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ClientSDKCacheContext } from '../../context/clientSDKCacheContext';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import { PureObject } from '../../interfaces';

export type FetchLatestDatapointCall = (
  timeseriesId: InternalId
) => Promise<DatapointsGetDatapoint[]>;

export type FetchTimeserieCall = (
  timeseriesId: InternalId
) => Promise<GetTimeSeriesMetadataDTO[]>;

export interface TimeseriesPreviewProps {
  timeseriesId: number;
  color?: string;
  dateFormat?: string;
  updateInterval?: number;
  valueToDisplay?: GetDoubleDatapoint | GetStringDatapoint;
  dropdown?: TimeseriesPreviewMenuConfig;
  retrieveTimeseries?: FetchTimeserieCall;
  retrieveLatestDatapoint?: FetchLatestDatapointCall;
  formatDisplayValue?: (value: string | number | undefined) => string | number;
  toggleVisibility?: (timeseries: GetTimeSeriesMetadataDTO) => void;
  styles?: TimeseriesPreviewStyles;
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

const defaultProps = {
  color: '#6c65ee',
  dateFormat: 'DD MMM YYYY - HH:mm:ss',
  updateInterval: 5000,
};

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

const TimeseriesPreview: React.FC<TimeseriesPreviewProps> = ({
  timeseriesId,
  dropdown,
  toggleVisibility,
  color = defaultProps.color,
  valueToDisplay,
  retrieveTimeseries,
  retrieveLatestDatapoint,
  updateInterval = defaultProps.updateInterval,
  dateFormat = defaultProps.dateFormat,
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

  const cachedContext = useContext(ClientSDKCacheContext);
  const context = useContext(ClientSDKContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [timeseries, setTimeseries] = useState<GetTimeSeriesMetadataDTO>();
  const [intervalPointer, setIntervalPointer] = useState<number | undefined>();
  const [latestDatapoint, setLatestDatapoint] = useState<
    GetDoubleDatapoint | GetStringDatapoint
  >();

  const onVisibilityClick = () => {
    if (toggleVisibility && timeseries) {
      toggleVisibility(timeseries);
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
          : await cachedContext!.timeseries.retrieve([{ id }]);

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

    if (typeof valueToDisplay === 'undefined') {
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
              <ActionIcon
                data-test-id={'visibility'}
                type="eye"
                onClick={onVisibilityClick}
              />
              {dropdownMenu}
            </LeftSide>
            <RightSide style={rightSideStyle}>
              <TagName style={tagNameStyle}>{timeseries.name}</TagName>
              <p style={descriptionStyle}>{timeseries.description}</p>
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

const Component = withDefaultTheme(TimeseriesPreview);
Component.displayName = 'TimeseriesPreview';

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
