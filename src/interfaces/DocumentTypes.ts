import { File } from '@cognite/sdk';
import { CollapseProps } from 'antd/lib/collapse';
import React from 'react';

export type Document = File;

export type OnDocumentClick = (
  document: Document,
  category: string,
  description: string
) => void;

export interface DocumentType {
  key: string;
  description: string;
}

export interface JsonDocTypes {
  [s: string]: string;
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

export type DocumentRenderer = (
  document: Document,
  i: number,
  documents: Document[]
) => React.ReactNode;

export interface MetaDocProps {
  handleDocumentClick?: OnDocumentClick;
  collapseProps?: CollapseProps;
  categoryPriorityList?: string[];
  unknownCategoryName?: string;
  documentTitleField?: string;

  /**
   * The {@code metadata} field used to group documents into types. If this is
   * not specified, then {@code doc_type} field will be attempted. If no
   * {@code doc_type} field is present in the metadata, then the filename will
   * be attempted to be parsed using the NORSOK standard. If this fails, then
   * the document will be in the "unknown" group.
   */
  documentTypeField?: string;
  docTypes?: JsonDocTypes;
  noDocumentsSign?: string;
  documentRenderer?: DocumentRenderer;
  customCategorySort?: (a: string, b: string) => number;
}

export interface DocumentTableProps extends MetaDocProps {
  docs: Document[];
}
