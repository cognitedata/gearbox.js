// Copyright 2020 Cognite AS
import { Timeseries, TimeseriesFilterQuery } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithAssetTimeseriesDataProps {
  assetTimeseries: Timeseries[];
}

export interface WithAssetTimeseriesProps {
  /**
   * Asset ID
   */
  assetId: number;
  /**
   * Additional parameters for SDK call. Please notice that assetId
   * provided in props will override the one in queryParams
   */
  queryParams?: TimeseriesFilterQuery;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: ReactNode;
  /**
   * Function to be called after timeseries have been fetched
   */
  onAssetTimeseriesLoaded?: (assetTimeseries: Timeseries[]) => void;
}

export interface WithAssetTimeseriesState {
  isLoading: boolean;
  assetTimeseries: Timeseries[] | null;
  assetId: number;
}
