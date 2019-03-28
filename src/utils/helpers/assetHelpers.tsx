import { VMetadata } from 'utils/validators/index';

export const mapAssetMetaData = (metaObject: VMetadata) =>
  Object.keys(metaObject).map(dp => ({
    key: dp,
    name: dp,
    value: (metaObject as any)[dp],
  }));
