import { AdvancedSearch } from './index';

export interface ApiQuery {
  fetchingLimit: number;
  assetSubtrees: number[] | null;
  query: string;
  advancedSearch: AdvancedSearch | null;
}
