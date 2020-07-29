// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';
import { NODE_LIST } from '../../mocks';
import { MockCogniteClient } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { ThreeDNodeTree } from './ThreeDNodeTree';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  viewer3D: any = {
    listRevealNodes3D: jest.fn().mockReturnValue({ items: NODE_LIST }),
  };
}

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
