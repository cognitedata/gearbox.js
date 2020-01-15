import { CSSProperties, ReactNode } from 'react';
import { AnyIfEmpty } from '../../interfaces';
import {
  AssetDocumentsPanelStyles,
  MetaDocProps,
} from '../AssetDocumentsPanel';
import { AssetEventsPanelStyles, MetaEventsProps } from '../AssetEventsPanel';
import {
  AssetTimeseriesPanelStyles,
  MetaTimeseriesProps,
} from '../AssetTimeseriesPanel';
import { MetaDescriptionListProps } from '../DescriptionList';

export type AssetPanelType = 'details' | 'events' | 'documents' | 'timeseries';

export interface AssetMetaStyles {
  header?: CSSProperties;
  emptyTab?: CSSProperties;
  details?: CSSProperties;
  timeseries?: AssetTimeseriesPanelStyles;
  documents?: AssetDocumentsPanelStyles;
  events?: AssetEventsPanelStyles;
}

export interface AssetMetaProps {
  /**
   * Asset Id
   */
  assetId: number;
  /**
   * List of panes to be hidden
   */
  hidePanels?: AssetPanelType[];
  /**
   * Defines pane that will be activated once the data has been loaded
   */
  tab?: string;
  /**
   * Function triggered when a user changes panes
   */
  onPaneChange?: (key: string) => void;
  /**
   * Object passed as props to inner component that presents details pane
   */
  detailsProps?: MetaDescriptionListProps;
  /**
   * Object passed as props to inner component that presents timeseries pane
   */
  timeseriesProps?: MetaTimeseriesProps;
  /**
   * Object passed as props to inner component that presents documents pane
   */
  docsProps?: MetaDocProps;
  /**
   * Object passed as props to inner component that presents events pane
   */
  eventProps?: MetaEventsProps;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: ReactNode;
  /**
   * Object that defines inline CSS styles for inner elements of the component.
   */
  styles?: AssetMetaStyles;
  /**
   * @ignore
   */
  theme?: AnyIfEmpty<{}>;
}
