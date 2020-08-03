// Copyright 2020 Cognite AS
import { CogniteClient } from '@cognite/sdk';
import { SDK_EXCLUDE_FROM_TRACKING_METHODS } from '../constants/sdk';

export type ExcludeMethods = typeof SDK_EXCLUDE_FROM_TRACKING_METHODS[number];
export type ClientApiKeys = Exclude<keyof CogniteClient, ExcludeMethods>;
export type ClientApiTypes = CogniteClient[ClientApiKeys];
