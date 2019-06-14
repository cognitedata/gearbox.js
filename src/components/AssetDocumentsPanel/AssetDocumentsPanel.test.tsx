import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
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

const fakeClient: API = {
  // @ts-ignore
  files: {
    list: jest.fn(),
  },
};

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
      <ClientSDKProvider client={fakeClient}>
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
