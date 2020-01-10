import { CogniteEvent, EventFilterRequest } from '@cognite/sdk';
import React from 'react';

export interface WithAssetEventsDataProps {
  assetEvents: CogniteEvent[];
}

export interface WithAssetEventsProps {
  assetId: number;
  queryParams?: EventFilterRequest;
  customSpinner?: React.ReactNode;
  onAssetEventsLoaded?: (assetEvents: CogniteEvent[]) => void;
}

export interface WithAssetEventsState {
  isLoading: boolean;
  assetEvents: CogniteEvent[] | null;
  assetId: number;
}
