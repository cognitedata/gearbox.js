// Copyright 2020 Cognite AS
import { DoubleDatapoint, StringDatapoint, Timeseries } from '@cognite/sdk';
import { Card, Dropdown, Icon, Menu } from 'antd';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc';
import {
  DropdownMenuStyles,
  TimeseriesPreviewMenuConfig,
  TimeseriesPreviewProps,
} from './interfaces';

interface GenarateDropdownMenuProps extends TimeseriesPreviewMenuConfig {
  timeseries: Timeseries;
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
  color = '#6c65ee',
  valueToDisplay,
  nameFormatter,
  descriptionFormatter,
  retrieveTimeseries,
  retrieveLatestDatapoint,
  updateInterval = 5000,
  dateFormat = 'DD MMM YYYY - HH:mm:ss',
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
  const [timeseries, setTimeseries] = useState<Timeseries>();
  const [intervalPointer, setIntervalPointer] = useState<number | undefined>();
  const [latestDatapoint, setLatestDatapoint] = useState<
    DoubleDatapoint | StringDatapoint
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
