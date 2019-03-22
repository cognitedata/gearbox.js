import { VMetadataId } from './VMetadata';

export interface VAdvancedSearch {
  name?: string;
  description?: string;
  metadata?: VMetadataId[];
}
