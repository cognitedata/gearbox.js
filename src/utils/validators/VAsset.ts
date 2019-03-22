import { VId } from './VGenericTypes';
import { VMetadata } from './VMetadata';

export interface VAsset {
  id: VId;
  path?: number[];
  name?: string;
  description?: string;
  metadata?: VMetadata;
}
