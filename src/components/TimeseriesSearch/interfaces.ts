import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import React from 'react';
import { PureObject } from '../../interfaces';

export interface TimeseriesSearchStyles {
  buttonRow?: React.CSSProperties;
  list?: React.CSSProperties;
  selectAllButton?: React.CSSProperties;
  selectNoneButton?: React.CSSProperties;
}

export interface TimeseriesSearchProps {
  /**
   * Callback function called when the selection changes. Called with two parameters:
   * the current list of selected ids and the last added/removed timeseries
   */
  onTimeserieSelectionChange: (
    newTimeseriesIds: number[],
    selectedTimeseries: GetTimeSeriesMetadataDTO | null
  ) => void;
  /**
   * List of preselected timeseries
   */
  selectedTimeseries: number[];
  /**
   * Removes the checkboxes from search result and will only callback with one id
   */
  single: boolean;
  /**
   * Hides the row with selected timeseries above the search bar
   */
  hideSelected: boolean;
  /**
   * Allows the user to select search results that are strings
   */
  allowStrings: boolean;
  /**
   * The selected root asset id. undefined will select all
   */
  rootAsset?: number;
  /**
   * Custom rule to filter search results
   */
  filterRule?: (timeseries: GetTimeSeriesMetadataDTO) => boolean;
  /**
   * Function called on fetch timeseries error
   */
  onError?: (error: Error) => void;
  /**
   * Custom styles for the component
   */
  styles?: TimeseriesSearchStyles;
  /**
   * Enable/disable RootAssetSelect component
   */
  rootAssetSelect: boolean;
  strings: PureObject;
}
