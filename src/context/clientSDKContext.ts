import { API } from '@cognite/sdk/dist/src/resources/api';
import React from 'react';

export type ClientSDKContextType = API | null;

export const ClientSDKContext = React.createContext<ClientSDKContextType>(null);
