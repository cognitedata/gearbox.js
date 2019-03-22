import { VAdvancedSearch, VId } from 'utils/validators';

export interface VApiQuery {
  fetchingLimit: number;
  assetSubtrees: VId[] | null;
  boostName: boolean;
  query: string;
  advancedSearch: VAdvancedSearch | null;
}
