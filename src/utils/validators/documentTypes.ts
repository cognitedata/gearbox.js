import React from 'react';

export interface Document {
  id: number;
  fileName: string;
  metadata?: Metadata;
}

export interface Metadata {
  [s: string]: string;
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
