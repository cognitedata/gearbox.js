import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { fakeEvents } from '../../mocks';
import { MockCogniteClient } from '../../utils/mockSdk';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import { AssetEventsPanel, AssetEventsPanelProps } from './AssetEventsPanel';
import { AssetEventsPanelPure } from './components/AssetEventsPanelPure';

configure({ adapter: new Adapter() });

const mockEventsList = jest.fn();

class CogniteClient extends MockCogniteClient {
  events: any = {
    list: mockEventsList,
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('AssetEventsPanel', () => {
  beforeEach(() => {
    mockEventsList.mockReturnValue({
      autoPagingToArray: () => Promise.resolve(fakeEvents),
    });
  });

  it('Should render without exploding and load data', done => {
    const props: AssetEventsPanelProps = { assetId: 123 };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <AssetEventsPanel {...props} />
      </ClientSDKProvider>
    );
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);

    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(AssetEventsPanelPure);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().assetEvents).toEqual(fakeEvents);
      done();
    });
  });
});
