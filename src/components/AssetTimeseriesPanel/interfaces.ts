import React from 'react';
import { WithAssetTimeseriesProps } from '../../hoc';
import { AnyIfEmpty } from '../../interfaces';
import { TimeseriesChartMetaProps } from '../TimeseriesChartMeta';

export interface AssetTimeseriesPanelStyles {
  wrapper?: React.CSSProperties;
  timeseriesContainer?: React.CSSProperties;
}

export interface MetaTimeseriesProps
  extends Omit<TimeseriesChartMetaProps, 'timeseries'> {
  strings?: {
    noTimeseriesSign?: string;
  };
  styles?: AssetTimeseriesPanelStyles;
  theme?: AnyIfEmpty<{}>;
}

export type AssetTimeseriesPanelProps = WithAssetTimeseriesProps &
  MetaTimeseriesProps;
