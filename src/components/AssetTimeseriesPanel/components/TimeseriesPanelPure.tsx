import { Collapse } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { WithAssetTimeseriesDataProps } from '../../../hoc/withAssetTimeseries';
import {
  TimeseriesChartMetaProps,
  TimeseriesChartMetaPure,
} from '../../TimeseriesChartMeta/TimeseriesChartMetaPure';

export interface MetaTimeseriesProps
  extends Omit<TimeseriesChartMetaProps, 'timeseries'> {
  strings?: {
    noTimeseriesSign?: string;
  };
}

export interface TimeseriesPanelProps
  extends MetaTimeseriesProps,
    WithAssetTimeseriesDataProps {}

export class TimeseriesPanelPure extends React.PureComponent<
  TimeseriesPanelProps
> {
  static defaultProps = {
    strings: {
      noTimeseriesSign: 'No timeseries linked to this asset',
    },
  };

  render() {
    const { strings, assetTimeseries, ...rest } = this.props;

    if (!assetTimeseries || !assetTimeseries.length) {
      return (
        <NoTimeseries data-test-id="no-timeseries">{`${
          strings!.noTimeseriesSign
        }`}</NoTimeseries>
      );
    }

    return (
      <>
        <TableWrapper>
          <CollapseContainer>
            {assetTimeseries &&
              assetTimeseries.map(ts => (
                <PanelWrapper header={ts.name} key={ts.id.toString()}>
                  <TimeseriesChartMetaPure
                    key={ts.id}
                    timeseries={ts}
                    {...rest}
                  />
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
