import { Breadcrumb } from 'antd';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MockCogniteClient } from '../../mocks/mockSdk';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { AssetBreadcrumb, AssetBreadcrumbProps } from './AssetBreadcrumb';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });
const defaultProps = {
  assetId: 3,
};
const assetMocks = [
  {
    id: 0,
    rootId: 0,
    name: 'Asset 0',
    description: 'description',
    metadata: {},
    createdTime: new Date(0),
    lastUpdatedTime: new Date(0),
  },
  {
    id: 1,
    rootId: 0,
    parentId: 0,
    name: 'Asset 1',
    description: 'description',
    metadata: {},
    createdTime: new Date(0),
    lastUpdatedTime: new Date(0),
  },
  {
    id: 2,
    rootId: 0,
    parentId: 1,
    name: 'Asset 2',
    description: 'description',
    metadata: {},
    createdTime: new Date(0),
    lastUpdatedTime: new Date(0),
  },
  {
    id: 3,
    rootId: 0,
    parentId: 2,
    name: 'Asset 3',
    description: 'description',
    metadata: {},
    createdTime: new Date(0),
    lastUpdatedTime: new Date(0),
  },
  {
    id: 4,
    rootId: 0,
    parentId: 3,
    name: 'Asset 4',
    description: 'description',
    metadata: {},
    createdTime: new Date(0),
    lastUpdatedTime: new Date(0),
  },
];

const mountComponent = (props: AssetBreadcrumbProps) =>
  mount(
    <ClientSDKProvider client={sdk}>
      <AssetBreadcrumb {...props} />
    </ClientSDKProvider>
  );

let wrapper: ReactWrapper;

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);
  sdk.assets.retrieve.mockImplementation((ids: { id: number }[]) => [
    assetMocks[Number(ids[0].id)],
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetBreadCrumb', () => {
  it('renders correctly when ids are specified', async () => {
    await act(async () => {
      wrapper = mountComponent(defaultProps as AssetBreadcrumbProps);
    });

    expect(wrapper.exists()).toBeTruthy();
  });
  it('should shrink breadcrumb length', async () => {
    const maxLength = 2;
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        maxLength,
      } as AssetBreadcrumbProps);
    });

    wrapper.update();

    const breadcrumbItems = wrapper.find(Breadcrumb.Item);
    const shrunkElement = breadcrumbItems.findWhere(el => el.text() === '...');

    expect(breadcrumbItems.length).toEqual(maxLength + 1);
    expect(shrunkElement.exists()).toBeTruthy();
  });
  it('should use provide function to render elements', async () => {
    const renderItem = jest.fn().mockImplementation(() => <div />);

    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        renderItem,
      } as AssetBreadcrumbProps);
    });

    wrapper.update();
    expect(renderItem).toHaveBeenCalled();
  });
  it('should trigger callbacks', async () => {
    const onBreadcrumbClick = jest.fn();

    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        onBreadcrumbClick,
      } as AssetBreadcrumbProps);
    });

    wrapper.update();

    const span = wrapper.find('span[role="button"]').at(0);

    span.simulate('click');
    expect(onBreadcrumbClick).toHaveBeenCalledTimes(1);
    span.simulate('keydown', { keyCode: 13 });
    expect(onBreadcrumbClick).toHaveBeenCalledTimes(2);
  });
  it('should use fetchAssets function if provided', async () => {
    const retrieveAsset = jest
      .fn()
      .mockImplementation((id: number) => assetMocks[id]);

    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        retrieveAsset,
      } as AssetBreadcrumbProps);
    });

    wrapper.update();
    expect(retrieveAsset).toHaveBeenCalled();
    expect(sdk.assets.retrieve).toHaveBeenCalledTimes(0);
  });
});
