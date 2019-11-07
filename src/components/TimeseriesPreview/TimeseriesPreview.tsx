import {
  DatapointsGetDatapoint,
  GetDoubleDatapoint,
  GetStringDatapoint,
  InternalId,
} from '@cognite/sdk';
import { TimeSeries } from '@cognite/sdk/dist/src/resources/classes/timeSeries';
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
) => Promise<TimeSeries[]>;

export interface TimeseriesPreviewProps {
  timeseriesId: number;
  toggleVisibility?: (timeseries: TimeSeries) => void;
  dropdown?: TimeseriesPreviewMenuConfig;
  color?: string;
  valueToDisplay?: GetDoubleDatapoint | GetStringDatapoint;
  retrieveTimeseries?: FetchTimeserieCall;
  retrieveLatestDatapoint?: FetchLatestDatapointCall;
  updateInterval?: number;
  dateFormat?: string;
  styles?: TimeseriesPreviewStyles;
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
  config: PureObject;
  onClick: (key: string, timeseries: TimeSeries) => void;
}

export interface DropdownMenuStyles {
  menu?: React.CSSProperties;
  item?: React.CSSProperties;
}

interface GenarateDropdownMenuProps extends TimeseriesPreviewMenuConfig {
  timeseries: TimeSeries;
  styles?: DropdownMenuStyles;
}

const defaultProps = {
  color: '#6c65ee',
};

const generateDropdownMenu = ({
  config,
  onClick,
  timeseries,
  styles = {},
}: GenarateDropdownMenuProps): JSX.Element => {
  const { menu = {}, item = {} } = styles;
  const options = Object.keys(config).map(key => (
    <Menu.Item key={key} onClick={() => onClick(key, timeseries)} style={item}>
      <span>{config[key]}</span>
    </Menu.Item>
  ));

  return (
    <Menu style={{ padding: 0, borderRadius: 0, ...menu }}>{options}</Menu>
  );
};

const TimeseriesPreview: React.FC<TimeseriesPreviewProps> = ({
  timeseriesId,
  dropdown,
  toggleVisibility,
  color = defaultProps.color,
  valueToDisplay,
  retrieveTimeseries,
  retrieveLatestDatapoint,
  updateInterval = 5000,
  dateFormat = 'DD MMM YYYY - hh:mm:ss',
  styles = {},
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

  const cachedContext = useContext(ClientSDKCacheContext);
  const context = useContext(ClientSDKContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [timeseries, setTimeseries] = useState<TimeSeries>();
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

  const displayValue = () =>
    valueToDisplay
      ? valueToDisplay.value
      : latestDatapoint
      ? latestDatapoint.value
      : undefined;

  const displayDate = () => {
    const date = valueToDisplay
      ? valueToDisplay.timestamp
      : latestDatapoint
      ? latestDatapoint.timestamp
      : undefined;

    return moment(date).format(dateFormat);
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
              <ActionIcon type="eye" onClick={onVisibilityClick} />
              {dropdownMenu}
            </LeftSide>
            <RightSide style={rightSideStyle}>
              <TagName style={tagNameStyle}>{timeseries.name}</TagName>
              <p style={descriptionStyle}>{timeseries.description}</p>
              <ValueContainer>
                <Value style={valueStyle}>{displayValue()}</Value>
                <DateValue style={dateStyle}>{displayDate()}</DateValue>
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
  align-items: flex-end;
`;
const Value = styled.span`
  font-weight: 600;
`;
const DateValue = styled.span`
  font-size: 0.8em;
`;
