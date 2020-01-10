import { Asset } from '@cognite/sdk';
import { Callback, PureObject } from '../../interfaces';
import { SearchStyles } from '../common/Search/interfaces';

export type AssetSearchStyles = SearchStyles;

export interface AssetSearchProps {
  /**
   * Enable root advanced search
   */
  advancedSearch: boolean;
  /**
   * Enable root asset selection
   */
  rootAssetSelect: boolean;
  /**
   * Triggers after selecting one of items from live search results list.
   * Required when showLiveSearchResults == true
   */
  onLiveSearchSelect?: (asset: Asset) => void;
  /**
   * flag to show live search results in dropdown list
   */
  showLiveSearchResults?: boolean;
  /**
   * Triggers when search error occurs
   */
  onError?: Callback;
  /**
   * Object of strings to be placed in component
   */
  strings?: PureObject;
  /**
   * Custom styles
   */
  styles?: AssetSearchStyles;
  /**
   * Triggers when search request finishes
   */
  onSearchResult?: (assets: Asset[]) => void;
}
