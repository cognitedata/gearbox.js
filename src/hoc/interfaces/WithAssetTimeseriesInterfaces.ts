import { GetTimeSeriesMetadataDTO, TimeseriesFilter } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithAssetTimeseriesDataProps {
  assetTimeseries: GetTimeSeriesMetadataDTO[];
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
  queryParams?: TimeseriesFilter;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: ReactNode;
  /**
   * Function to be called after timeseries have been fetched
   */
  onAssetTimeseriesLoaded?: (
    assetTimeseries: GetTimeSeriesMetadataDTO[]
  ) => void;
}

export interface WithAssetTimeseriesState {
  isLoading: boolean;
  assetTimeseries: GetTimeSeriesMetadataDTO[] | null;
  assetId: number;
}
