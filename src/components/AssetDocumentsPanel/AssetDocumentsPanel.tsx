import { withAssetFiles, WithAssetFilesProps } from '../../hoc/withAssetFiles';
import { MetaDocProps } from '../../interfaces';
import {
  DocumentsPanelStylesProps,
  DocumentTable,
} from './DocumentTable/DocumentTable';

export type AssetDocumentsPanelProps = WithAssetFilesProps &
  MetaDocProps &
  DocumentsPanelStylesProps;

DocumentTable.displayName = 'AssetDocumentsPanel';
export const AssetDocumentsPanel = withAssetFiles(DocumentTable);
