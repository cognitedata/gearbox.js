// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { fakeFiles, MockCogniteClient } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import { AssetDocumentsPanel } from './AssetDocumentsPanel';
import { DocumentTable } from './DocumentTable';
import { AssetDocumentsPanelProps } from './interfaces';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  files: any = {
    list: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('AssetDocumentsPanel', () => {
  beforeEach(() => {
    sdk.files.list.mockReturnValue({
      autoPagingToArray: () => Promise.resolve(fakeFiles),
    });
  });

  afterEach(() => {
    sdk.files.list.mockClear();
  });

  it('Should render without exploding and load data', done => {
    const props: AssetDocumentsPanelProps = { assetId: 123 };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <AssetDocumentsPanel {...props} />
      </ClientSDKProvider>
    );
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);

    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(DocumentTable);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().assetFiles).toEqual(fakeFiles);
      done();
    });
  });
});
