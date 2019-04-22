import { Asset } from '@cognite/sdk';
import { SyntheticEvent } from 'react';
import { AdvancedSearch } from './index';

export type ID = number | string;
export type OnClick = (event: SyntheticEvent) => void;
export type OnAssetListCallback = (assets: Asset[]) => void;
export type OnAdvancedSearchChange = (searchFields: AdvancedSearch) => void;

export type EmptyCallback = () => void;
export type StringsCallback = (strings: string[]) => void;
export type AnyTypeCallback = (item: any) => void;
export type IdCallback = (id: number) => void;
export type SetVideoRefCallback = (element: HTMLVideoElement | null) => void;

export interface OcrRequest {
  image: string;
  url?: string;
  key?: string;
}

export interface MetadataId {
  id: number;
  key: string;
  value: ID;
}

export interface ErrorResponse {
  status: number;
  message: string;
  error?: Error;
}

export interface PureObject {
  [name: string]: ID;
}
