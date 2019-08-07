import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { fakeFiles } from '../../mocks';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import {
  AssetDocumentsPanel,
  AssetDocumentsPanelProps,
} from './AssetDocumentsPanel';
import { DocumentTable } from './components/DocumentTable';

configure({ adapter: new Adapter() });

const fakeClient: CogniteClient = {
  // @ts-ignore
  files: {
    list: jest.fn(),
  },
};

jest.mock('@cognite/sdk', () => ({
  __esModule: true,
  CogniteClient: jest.fn().mockImplementation(() => {
    return fakeClient;
  }),
}));

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('AssetDocumentsPanel', () => {
  beforeEach(() => {
    // @ts-ignore
    fakeClient.files.list.mockReturnValue({
      autoPagingToArray: () => Promise.resolve(fakeFiles),
    });
  });

  afterEach(() => {
    // @ts-ignore
    fakeClient.files.list.mockClear();
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
