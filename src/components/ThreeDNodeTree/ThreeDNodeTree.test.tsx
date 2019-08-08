import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';
import { NODE_LIST } from '../../mocks/threeDNodesList';
import { ClientSDKProvider } from '../ClientSDKProvider/ClientSDKProvider';
import { ThreeDNodeTree } from './ThreeDNodeTree';

configure({ adapter: new Adapter() });

const fakeClient: CogniteClient = {
  // @ts-ignore
  viewer3D: {
    listRevealNodes3D: jest.fn().mockReturnValue({ items: NODE_LIST }),
  },
};

jest.mock('@cognite/sdk', () => ({
  __esModule: true,
  CogniteClient: jest.fn().mockImplementation(() => {
    return fakeClient;
  }),
}));

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('ThreeDNodeTree', () => {
  it('renders without exposion', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <ThreeDNodeTree modelId={0} revisionId={0} />
      </ClientSDKProvider>
    );

    expect(wrapper).toHaveLength(1);
  });
  it('handles invalid onSelect callback', () => {
    const onSelect = sinon.fake.rejects(new Error('Error'));

    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <ThreeDNodeTree modelId={0} revisionId={0} onSelect={onSelect} />
      </ClientSDKProvider>
    );

    expect(wrapper).toHaveLength(1);
  });
});
