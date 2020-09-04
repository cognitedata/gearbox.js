// Copyright 2020 Cognite AS
import { CogniteEvent, EventFilterRequest } from '@cognite/sdk';
import { ReactNode } from 'react';

export interface WithAssetEventsDataProps {
  assetEvents: CogniteEvent[];
}

export interface WithAssetEventsProps {
  /**
   * Asset ID
   */
  assetId: number;
  /**
   * Additional parameters for SDK call. Please notice that assetId
   * provided in props will override property assetIds in queryParams.filter
   */
  queryParams?: EventFilterRequest;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: ReactNode;
  /**
   * Function to be called after events have been fetched
   */
  onAssetEventsLoaded?: (assetEvents: CogniteEvent[]) => void;
}

export interface WithAssetEventsState {
  isLoading: boolean;
  assetEvents: CogniteEvent[] | null;
  assetId: number;
}
