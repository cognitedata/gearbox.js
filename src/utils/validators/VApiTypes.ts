import { VMetadata, VId, VAdvancedSearch } from './index';

export interface VApiQuery {
  fetchingLimit: number;
  assetSubtrees: VId[] | null;
  boostName: boolean;
  query: string;
  advancedSearch: VAdvancedSearch | null;
}

export interface VApiEvent {
  id: VId;
  startTime: number;
  endTime: number;
  type?: string;
  subtype?: string;
  assetIds?: VId[];
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
