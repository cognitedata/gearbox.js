import { AdvancedSearch } from './index';

export interface ApiQuery {
  fetchingLimit: number;
  assetSubtrees: number[] | null;
  query: string;
  advancedSearch: AdvancedSearch | null;
}

export interface ApiAssetList {
  query: string;
  fuzziness?: number;
  fuzzLimit?: number;
}
