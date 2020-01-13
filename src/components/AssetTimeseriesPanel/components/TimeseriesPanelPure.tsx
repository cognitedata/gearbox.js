import { Collapse } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { WithAssetTimeseriesDataProps, withDefaultTheme } from '../../../hoc';
import { defaultTheme } from '../../../theme/defaultTheme';
import { TimeseriesChartMetaPure } from '../../TimeseriesChartMeta/TimeseriesChartMetaPure';
import { MetaTimeseriesProps } from '../interfaces';

export interface TimeseriesPanelProps
  extends MetaTimeseriesProps,
    WithAssetTimeseriesDataProps {}

export class TimeseriesPanelPureComponent extends React.PureComponent<
  TimeseriesPanelProps
> {
  static defaultProps = {
    strings: {
      noTimeseriesSign: 'No timeseries linked to this asset',
    },
    theme: { ...defaultTheme },
  };

  render() {
    const { strings, assetTimeseries, styles, ...rest } = this.props;

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
          <CollapseContainer style={styles && styles.wrapper}>
            {assetTimeseries &&
              assetTimeseries.map(ts => (
                <PanelWrapper
                  header={ts.name}
                  key={ts.id.toString()}
                  style={styles && styles.timeseriesContainer}
                >
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

const Component = withDefaultTheme(TimeseriesPanelPureComponent);

export { Component as TimeseriesPanelPure };
