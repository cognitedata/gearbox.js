import React from 'react';
import { WithAssetTimeseriesProps } from '../../hoc';
import { AnyIfEmpty } from '../../interfaces';
import { TimeseriesChartMetaProps } from '../TimeseriesChartMeta';

export interface AssetTimeseriesPanelStyles {
  wrapper?: React.CSSProperties;
  timeseriesContainer?: React.CSSProperties;
}

export interface MetaTimeseriesProps
  extends Omit<TimeseriesChartMetaProps, 'timeseriesId'> {
  /**
   * Strings that can be customized
   */
  strings?: {
    noTimeseriesSign?: string;
  };
  /**
   * Custom styles for component
   */
  styles?: AssetTimeseriesPanelStyles;
  /**
   * @ignore
   */
  theme?: AnyIfEmpty<{}>;
}

export type AssetTimeseriesPanelProps = WithAssetTimeseriesProps &
  MetaTimeseriesProps;
