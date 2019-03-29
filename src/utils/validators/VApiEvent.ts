import { VMetadata } from './VMetadata';
import { VId } from './VGenericTypes';

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
