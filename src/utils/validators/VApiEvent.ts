import { VMetadata } from './VMetadata';
import { VId } from './VGenericTypes';

export interface VApiEvent {
  id: VId;
  startTime: number;
  endTime: number;
  description: string;
  type: string;
  subtype: string;
  metadata: VMetadata;
  assetIds: VId[];
}
