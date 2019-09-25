import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';

import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SVGViewer } from '../SVGViewer';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  files: any = {
    getDownloadUrls: async () => [{ downloadUrl: 'url', id: 123 }],
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('SVGViewer', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer documentId={0} />
      </ClientSDKProvider>
    );
    expect(wrapper.find('[data-test-id="close-svgviewer-btn"]').length).toBe(0);
    expect(wrapper).toHaveLength(1);
  });

  it('Renders a cancel button', () => {
    const handleCancel = sinon.spy();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer documentId={0} handleCancel={handleCancel} />
      </ClientSDKProvider>
    );
    const closeButton = wrapper.find('[data-test-id="close-svgviewer-btn"]');
    expect(closeButton).toBeTruthy();
    closeButton.first().simulate('click');

    expect(handleCancel.called).toBeTruthy();
  });
});
