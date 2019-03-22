import { VId } from './VGenericTypes';

export interface VMetadata {
  [name: string]: string;
}

export interface VMetadataId {
  id: VId;
  key: string;
  value: VId;
}
