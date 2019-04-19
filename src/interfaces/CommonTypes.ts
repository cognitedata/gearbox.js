import { Asset } from '@cognite/sdk';
import { SyntheticEvent } from 'react';
import { ApiQuery, AdvancedAssetSearch } from './index';

export type ID = number | string;
export type OnClick = (event: SyntheticEvent) => void;
export type OnAssetSearchResult = (result: any, apiQuery?: ApiQuery) => void;
export type OnAssetSearch = (apiQuery: ApiQuery) => void;
export type OnAssetListCallback = (assets: Asset[]) => void;
export type OnAdvancedSearchChange = (
  searchFields: AdvancedAssetSearch
) => void;

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

export interface ListElementObject {
  name: ID;
  [n: string]: any;
}
