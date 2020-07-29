// Copyright 2020 Cognite AS
import { CogniteClient } from '@cognite/sdk';
import React from 'react';

export interface ClientSDKProviderProps {
  client: CogniteClient;
  children: React.ReactNode;
}
