import VMetadata from './VMetadata';

export default interface VApiEvent {
  id: number | string;
  startTime: number;
  endTime: number;
  description: string;
  type: string;
  subtype: string;
  metadata: VMetadata;
  assetIds: (number | string)[];
}
