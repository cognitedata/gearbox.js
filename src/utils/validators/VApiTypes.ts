import { VMetadata, VAdvancedSearch } from './index';

export interface VApiQuery {
  fetchingLimit: number;
  assetSubtrees: number[] | null;
  boostName: boolean;
  query: string;
  advancedSearch: VAdvancedSearch | null;
}

export interface VApiEvent {
  id: number;
  startTime: number;
  endTime: number;
  type?: string;
  subtype?: string;
  assetIds?: number[];
  description?: string;
  metadata?: VMetadata;
  source?: string;
  sourceId?: string;
  createdTime?: number;
  lastUpdatedTime?: number;
}

export interface VApiAssetList {
  query: string;
  fuzziness?: number;
  fuzzLimit?: number;
}
