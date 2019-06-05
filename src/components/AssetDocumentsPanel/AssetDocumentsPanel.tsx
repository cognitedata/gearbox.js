import { withAssetFiles } from '../../hoc/withAssetFiles';
import { MetaDocProps } from '../../interfaces';
import { DocumentTable } from './components/DocumentTable';

// export type AssetEventsPanelProps = AssetEventsPanelProps;
export type MetaDocProps = MetaDocProps;

export const AssetDocumentsPanel = withAssetFiles(DocumentTable);
