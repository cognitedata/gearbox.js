import { GetTimeSeriesMetadataDTO, TimeseriesFilter } from '@cognite/sdk';
import React from 'react';

export interface WithAssetTimeseriesDataProps {
  assetTimeseries: GetTimeSeriesMetadataDTO[];
}

export interface WithAssetTimeseriesProps {
  assetId: number;
  queryParams?: TimeseriesFilter;
  customSpinner?: React.ReactNode;
  onAssetTimeseriesLoaded?: (
    assetTimeseries: GetTimeSeriesMetadataDTO[]
  ) => void;
}

export interface WithAssetTimeseriesState {
  isLoading: boolean;
  assetTimeseries: GetTimeSeriesMetadataDTO[] | null;
  assetId: number;
}
