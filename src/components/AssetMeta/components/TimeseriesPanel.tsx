import { Timeseries } from '@cognite/sdk';
import { Collapse } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  TimeseriesChartMeta,
  TimeseriesChartMetaProps,
} from '../../TimeseriesChartMeta';

export interface MetaTimeseriesProps
  extends Omit<TimeseriesChartMetaProps, 'timeseries'> {
  strings?: {
    noTimeseriesSign?: string;
  };
}
export interface TimeseriesPanelStyles {
  wrapper?: React.CSSProperties;
  timeseriesContainer?: React.CSSProperties;
}

export interface TimeseriesPanelProps extends MetaTimeseriesProps {
  timeseries?: Timeseries[];
  styles?: TimeseriesPanelStyles;
}

export class TimeseriesPanel extends React.PureComponent<TimeseriesPanelProps> {
  static defaultProps = {
    strings: {
      noTimeseriesSign: 'No timeseries linked to this asset',
    },
  };

  render() {
    const { strings, timeseries, styles, ...rest } = this.props;

    if (!timeseries || !timeseries.length) {
      return (
        <NoTimeseries data-test-id="no-timeseries">{`${
          strings!.noTimeseriesSign
        }`}</NoTimeseries>
      );
    }

    return (
      <>
        <TableWrapper>
          <CollapseContainer style={styles && styles.wrapper}>
            {timeseries &&
              timeseries.map(ts => (
                <PanelWrapper
                  style={styles && styles.timeseriesContainer}
                  header={ts.name}
                  key={ts.id.toString()}
                >
                  <TimeseriesChartMeta key={ts.id} timeseries={ts} {...rest} />
                </PanelWrapper>
              ))}
          </CollapseContainer>
        </TableWrapper>
      </>
    );
  }
}

const PanelWrapper = styled(Collapse.Panel)`
  text-align: left;
`;

const TableWrapper = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const CollapseContainer = styled(Collapse)`
  width: 100%;
`;

const NoTimeseries = styled.div`
  padding: 16px;
`;
