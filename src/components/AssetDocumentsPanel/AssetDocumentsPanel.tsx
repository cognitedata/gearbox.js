import { withAssetFiles } from '../../hoc/withAssetFiles';
import { DocumentTable } from './DocumentTable/DocumentTable';

export const AssetDocumentsPanel = withAssetFiles(DocumentTable);
