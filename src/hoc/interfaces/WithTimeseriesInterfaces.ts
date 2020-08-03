// Copyright 2020 Cognite AS
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithTimeseriesDataProps {
  timeseries: GetTimeSeriesMetadataDTO;
}

export interface WithTimeseriesProps {
  /**
   * TimeseriesID
   */
  timeseriesId: number;
  /**
   * A custom spinner to be shown while data is being loaded
   */
  customSpinner?: ReactNode;
}

export interface WithTimeseriesState {
  isLoading: boolean;
  timeseries: GetTimeSeriesMetadataDTO | null;
  timeseriesId: number;
}
