import React from 'react';
import { CollapseProps } from 'antd/lib/collapse';
import { VMetadata } from './index';

export interface Document {
  id: number;
  fileName: string;
  directory?: string;
  source?: string;
  sourceId?: string;
  fileType?: string;
  metadata?: VMetadata;
  assetIds?: number[];
  uploaded?: boolean;
  uploadedAt?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
}

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

export interface DocumentTableProps {
  docs: Document[];
  handleDocumentClick?: (
    document: Document,
    category: string,
    description: string
  ) => void;
  collapseProps?: CollapseProps;
  categoryPriorityList?: string[];
  unknownCategoryName?: string;
  documentTitleField?: string;
  documentTypeField?: string;
  docTypes?: JsonDocTypes;
  noDocumentsSign?: string;
  documentRenderer?: DocumentRenderer;
}
