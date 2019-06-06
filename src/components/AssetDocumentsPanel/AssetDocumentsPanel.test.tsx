import * as sdk from '@cognite/sdk';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { DOCUMENTS } from '../../mocks';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import {
  AssetDocumentsPanel,
  AssetDocumentsPanelProps,
} from './AssetDocumentsPanel';
import { DocumentTable } from './components/DocumentTable';

configure({ adapter: new Adapter() });

sdk.Files.list = jest.fn();

describe('AssetDocumentsPanel', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.Files.list.mockResolvedValue({ items: DOCUMENTS });
  });

  it('Should render without exploding and load data', done => {
    const props: AssetDocumentsPanelProps = { assetId: 123 };
    const wrapper = shallow(<AssetDocumentsPanel {...props} />);
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);

    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(DocumentTable);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().assetFiles).toEqual(DOCUMENTS);
      done();
    });
  });
});
