import { VMetadata } from './VMetadata';

export interface VAnnotation {
  type: string;
  subtype: string;
  startTime: number;
  endTime: number;
  description: string;
  additionalData?: VMetadata;
  metadata?: VMetadata;
}
