import { VId } from './VGenericTypes';
import { VMetadata } from './VMetadata';

export interface VTimeseries {
  id: VId;
  assetId: VId;
  createdTime?: number;
  description: string;
  isStep: boolean;
  isString: boolean;
  lastUpdatedTime?: number;
  metadata?: VMetadata;
  name: string;
}
