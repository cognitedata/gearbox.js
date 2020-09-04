// Copyright 2020 Cognite AS
import { withAssetFiles } from '../../hoc';
import { DocumentTable } from './DocumentTable/DocumentTable';
import { DocumentTableProps } from './interfaces';

export const AssetDocumentsPanel = withAssetFiles<DocumentTableProps>(
  DocumentTable
);
