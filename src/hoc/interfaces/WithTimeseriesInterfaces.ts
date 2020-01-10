import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import React from 'react';

export interface WithTimeseriesDataProps {
  timeseries: GetTimeSeriesMetadataDTO;
}

export interface WithTimeseriesProps {
  timeseriesId: number;
  customSpinner?: React.ReactNode;
}

export interface WithTimeseriesState {
  isLoading: boolean;
  timeseries: GetTimeSeriesMetadataDTO | null;
  timeseriesId: number;
}
