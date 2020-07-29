// Copyright 2020 Cognite AS
export const SDK_LIST_LIMIT = 1000;
export const SDK_EXCLUDE_FROM_TRACKING_METHODS = [
  'setOneTimeSdkHeader',
  'project',
  'loginWithOAuth',
  'loginWithApiKey',
  'setBaseUrl',
  'getMetadata',
  'get',
  'put',
  'post',
  'delete',
] as const;
