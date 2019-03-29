import { VId } from './VGenericTypes';
import { VMetadata } from './VMetadata';

export interface VAsset {
  id: VId;
  createdTime?: null;
  depth?: number;
  description?: string;
  metadata?: VMetadata;
  name?: string;
  path?: VId[];
}
