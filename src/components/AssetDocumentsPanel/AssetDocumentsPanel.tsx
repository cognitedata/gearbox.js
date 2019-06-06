import { withAssetFiles, WithAssetFilesProps } from '../../hoc/withAssetFiles';
import { MetaDocProps } from '../../interfaces';
import {
  DocumentsPanelStylesProps,
  DocumentTable,
} from './components/DocumentTable';

export type AssetDocumentsPanelProps = WithAssetFilesProps &
  MetaDocProps &
  DocumentsPanelStylesProps;
export type MetaDocProps = MetaDocProps;

export const AssetDocumentsPanel = withAssetFiles(DocumentTable);
