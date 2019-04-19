import { PureObject, AdvancedAssetSearch } from './index';

export interface ApiQuery {
  fetchingLimit: number;
  assetSubtrees: number[] | null;
  query: string;
  advancedSearch: AdvancedAssetSearch | null;
}

export interface ApiEvent {
  id: number;
  startTime: number;
  endTime: number;
  type?: string;
  subtype?: string;
  assetIds?: number[];
  description?: string;
  metadata?: PureObject;
  source?: string;
  sourceId?: string;
  createdTime?: number;
  lastUpdatedTime?: number;
}

export interface ApiAssetList {
  query: string;
  fuzziness?: number;
  fuzzLimit?: number;
}
