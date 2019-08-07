import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SVGViewer } from '../SVGViewer';

configure({ adapter: new Adapter() });

const fakeClient: CogniteClient = {
  // @ts-ignore
  files: {
    getDownloadUrls: async () => [{ downloadUrl: 'url', id: 123 }],
  },
};

jest.mock('@cognite/sdk', () => ({
  __esModule: true,
  CogniteClient: jest.fn().mockImplementation(() => {
    return fakeClient;
  }),
}));

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('SVGViewer', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer documentId={0} />
      </ClientSDKProvider>
    );
    expect(wrapper).toHaveLength(1);
  });
});
