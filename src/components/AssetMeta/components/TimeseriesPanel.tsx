import { Timeseries } from '@cognite/sdk';
import { Collapse } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { TimeseriesChart } from '../../TimeseriesChart';

const { Panel } = Collapse;

interface TimeseriesPanelState {
  // stateParam?: string;
}

export interface MetaTimeseriesProps {
  noTimeseriesSign?: string;
}

export interface TimeseriesPanelProps extends MetaTimeseriesProps {
  timeseries?: Timeseries[];
}

export class TimeseriesPanel extends React.PureComponent<
  TimeseriesPanelProps,
  TimeseriesPanelState
> {
  static defaultProps = {};

  render() {
    const { noTimeseriesSign, timeseries } = this.props;

    if (!timeseries || !timeseries.length) {
      return (
        <NoTimeseries data-test-id="no-timeseries">{`${
          noTimeseriesSign
            ? noTimeseriesSign
            : 'No timeseries linked to this asset'
        }`}</NoTimeseries>
      );
    }

    return (
      <>
        <TableWrapper>
          <CollapseContainer>
            {timeseries &&
              timeseries.map(ts => {
                return (
                  <PanelWrapper header={ts.name} key={ts.id.toString()}>
                    <TimeseriesChart timeseriesIds={[ts.id]} />
                  </PanelWrapper>
                );
              })}
          </CollapseContainer>
        </TableWrapper>
      </>
    );
  }
}

const TableWrapper = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const CollapseContainer = styled(Collapse)`
  width: 100%;
`;

const PanelWrapper = styled(Panel)`
  text-align: left;
`;

const NoTimeseries = styled.div`
  padding: 16px;
`;
