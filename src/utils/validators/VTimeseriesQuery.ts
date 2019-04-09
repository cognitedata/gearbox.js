import { VId } from 'utils/validators';

export interface VTimeseriesQuery {
  limit: number;
  query: string;
  assetSubtrees: VId[] | null;
}
