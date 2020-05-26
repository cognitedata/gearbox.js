import { FilesMetadata } from '@cognite/sdk';
import { CollapseProps } from 'antd/lib/collapse';
import { CSSProperties, ReactNode } from 'react';
import { WithAssetFilesDataProps, WithAssetFilesProps } from '../../hoc';
import { Theme } from '../../interfaces';

export type Document = FilesMetadata;

export type DocumentRenderer = (
  document: Document,
  i: number,
  documents: Document[]
) => ReactNode;

export type OnDocumentClick = (
  document: Document,
  category: string,
  description: string
) => void;

export interface JsonDocTypes {
  [s: string]: string;
}

export interface DocumentType {
  key: string;
  description: string;
}

export interface DocumentsByCategory {
  [s: string]: {
    description: string;
    documents: Document[];
  };
}

export interface Priority {
  [s: string]: number;
}

export interface DocumentsPanelStylesProps {
  /**
   * Object that defines inline CSS styles for inner elements of the component
   */
  styles?: AssetDocumentsPanelStyles;
}

export interface DocumentsPanelThemeProps {
  theme?: Theme;
}

export type DocumentTableProps = MetaDocProps &
  WithAssetFilesDataProps &
  DocumentsPanelStylesProps &
  DocumentsPanelThemeProps;

export interface AssetDocumentsPanelStyles {
  wrapper?: CSSProperties;
  fileContainer?: CSSProperties;
  fileLink?: CSSProperties;
  fileTitle?: CSSProperties;
}

export interface MetaDocProps {
  /**
   * Callback function triggered when user clicks on a file (document)
   */
  handleDocumentClick?: OnDocumentClick;
  /**
   * Object with props to be passed to atn design Collapse component
   */
  collapseProps?: CollapseProps;
  /**
   * List of categories codes to be shown on the top of the list.
   * Categories "P&ID" and "Logic Diagrams" are prioritized by default.
   */
  categoryPriorityList?: string[];
  /**
   * Name for the category that includes all files with undefined category
   */
  unknownCategoryName?: string;
  /**
   * Key to get document title from `metadata` object
   */
  documentTitleField?: string;
  /**
   * The `metadata` field used to group documents into types. If this is
   * not specified, then `doc_type` field will be attempted. If no
   * `doc_type` field is present in the metadata, then the filename will
   * be attempted to be parsed using the NORSOK standard. If this fails, then
   * the document will be in the "unknown" group.
   */
  documentTypeField?: string;
  /**
   * Object map used to show custom category names
   */
  docTypes?: JsonDocTypes;
  /**
   * Text to be shown if no documents have been found for the asset
   */
  noDocumentsSign?: string;
  /**
   * Custom render function to modify documents appearing
   */
  documentRenderer?: DocumentRenderer;
  /**
   * Function to sort categories after theirs prioritization
   */
  customCategorySort?: (a: string, b: string) => number;
}

export type AssetDocumentsPanelProps = WithAssetFilesProps &
  MetaDocProps &
  DocumentsPanelStylesProps;
