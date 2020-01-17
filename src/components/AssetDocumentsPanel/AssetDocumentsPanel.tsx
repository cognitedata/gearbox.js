import { withAssetFiles } from '../../hoc';
import { DocumentTable } from './DocumentTable/DocumentTable';

export const AssetDocumentsPanel = withAssetFiles(DocumentTable);
