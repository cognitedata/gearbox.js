import { SyntheticEvent } from 'react';
import { VApiQuery, VAdvancedSearch } from './';

type VId = number | string;
type VOnClick = (event: SyntheticEvent) => void;
type VOnAssetSearchResult = (result: any, apiQuery?: VApiQuery) => void;
type VOnAssetSearch = (apiQuery: VApiQuery) => void;
type VOnAssetSelected = (assetId: VId) => void;
type VOnAdvancedSearchChange = (searchFields: VAdvancedSearch) => void;

type VEmptyCallback = () => void;

export {
  VId,
  VOnClick,
  VOnAssetSearchResult,
  VOnAssetSearch,
  VOnAssetSelected,
  VOnAdvancedSearchChange,
  VEmptyCallback,
};
