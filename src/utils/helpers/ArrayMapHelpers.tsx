import { VMetadata } from 'utils/validators/index';

export const mapMetaData = (metaObject: VMetadata) =>
  Object.keys(metaObject).map(dp => ({
    key: dp,
    name: dp,
    value: (metaObject as any)[dp],
  }));
