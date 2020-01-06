import { FilesMetadata } from '@cognite/sdk';
import React from 'react';
import { AssetDocumentsPanelStyles } from '../../../interfaces';
import { DOCUMENTS, sleep } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
class CogniteClient extends MockCogniteClient {
  files: any = {
    list: () => ({
      autoPagingToArray: () => {
        return new Promise(async resolve => {
          await sleep(1000);
          resolve(DOCUMENTS);
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
