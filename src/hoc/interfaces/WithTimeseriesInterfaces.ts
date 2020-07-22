// Copyright 2020 Cognite AS
import { Timeseries } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithTimeseriesDataProps {
  timeseries: Timeseries;
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
  timeseries: Timeseries | null;
  timeseriesId: number;
}
