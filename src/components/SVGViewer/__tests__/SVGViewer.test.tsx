import { API } from '@cognite/sdk/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SVGViewer } from '../SVGViewer';

configure({ adapter: new Adapter() });

const fakeClient: API = {
  // @ts-ignore
  files: {
    getDownloadUrls: async () => [{ downloadUrl: 'url', id: 123 }],
  },
};

describe('SVGViewer', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <SVGViewer documentId={0} />
      </ClientSDKProvider>
    );
    expect(wrapper).toHaveLength(1);
  });
});
