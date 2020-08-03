// Copyright 2020 Cognite AS
import { CogniteClient } from '@cognite/sdk';
import React from 'react';

export type ClientSDKContextType = CogniteClient | null;
export const ClientSDKContext = React.createContext<ClientSDKContextType>(null);
