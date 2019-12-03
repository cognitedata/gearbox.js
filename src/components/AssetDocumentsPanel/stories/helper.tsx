import { FilesMetadata } from '@cognite/sdk';
import React from 'react';
import { AssetDocumentsPanelStyles } from '../../../interfaces';
import { DOCUMENTS } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
class CogniteClient extends MockCogniteClient {
  files: any = {
    list: () => ({
      autoPagingToArray: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(DOCUMENTS);
          }, 1000);
        });
      },
    }),
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const handleAssetFilesLoaded = (files: FilesMetadata[]) => {
  console.log(files);
};

export const docTypes = { XB: 'My Category', XL: 'Another Custom Category' };

export const customStyle: AssetDocumentsPanelStyles = {
  wrapper: { border: '1px solid red' },
  fileContainer: { backgroundColor: '#DDD', padding: 8 },
  fileLink: { color: 'purple' },
  fileTitle: { color: 'magenta', fontSize: '1em' },
};
