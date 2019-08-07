import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { timeseriesListV2 } from '../../mocks';

import { ClientSDKProvider } from '../ClientSDKProvider';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import {
  AssetTimeseriesPanel,
  AssetTimeseriesPanelProps,
} from './AssetTimeseriesPanel';
import { TimeseriesPanelPure } from './components/TimeseriesPanelPure';

configure({ adapter: new Adapter() });

const fakeClient: CogniteClient = {
  // @ts-ignore
  timeseries: {
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

describe('AssetTimeseriesPanel', () => {
  beforeEach(() => {
    // @ts-ignore
    mockedClient.timeseries.list.mockReturnValue({
      autoPagingToArray: async () => timeseriesListV2,
    });
  });

  it('Should render without exploding and load data', done => {
    const props: AssetTimeseriesPanelProps = { assetId: 123 };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <AssetTimeseriesPanel {...props} />
      </ClientSDKProvider>
    );
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);
    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(TimeseriesPanelPure);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().assetTimeseries).toEqual(timeseriesListV2);
      done();
    });
  });
});
