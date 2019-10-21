import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { ASSET_DATA } from '../../mocks';
import { DescriptionList } from './DescriptionList';

const ANT_COLLAPSE_HEADER = '.ant-collapse-header';
const ANT_COLLAPSE_CONTENT = '.ant-collapse-content';
const SAMPLE_PROPS = { 1: '1', 2: '1', 3: '2' };
const toCategoryByName = (name: string) =>
  Number.parseInt(name, 10) < 3 ? '1' : '2';

configure({ adapter: new Adapter() });

describe('AssetDetailsPanel', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <div>
          <DescriptionList valueSet={ASSET_DATA.metadata} />
          <DescriptionList valueSet={[]} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render description', () => {
    const tree = renderer
      .create(
        <div>
          <DescriptionList
            valueSet={ASSET_DATA.metadata}
            description={{
              descriptionId: '123',
              descriptionText: 'description',
            }}
          />
          <DescriptionList valueSet={[]} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render collapse for 2 categories', () => {
    const wrapper = mount(
      <DescriptionList valueSet={SAMPLE_PROPS} toCategory={toCategoryByName} />
    );
    wrapper
      .find(ANT_COLLAPSE_HEADER)
      .map(collapse => collapse.simulate('click'));
    expect(
      wrapper
        .find(ANT_COLLAPSE_CONTENT)
        .map(expand => expand.find('dt').map(item => item.text()))
    ).toEqual([['1', '2'], ['3']]);
  });

  it("shouldn't render collapse for 1 category", () => {
    const toCategory = () => 'category';
    const wrapper = mount(
      <DescriptionList valueSet={ASSET_DATA.metadata} toCategory={toCategory} />
    );
    expect(wrapper.exists(ANT_COLLAPSE_HEADER)).toBeFalsy();
  });

  it("shouldn't render collapse for 0 categories", () => {
    const wrapper = mount(<DescriptionList valueSet={ASSET_DATA.metadata} />);
    expect(wrapper.exists(ANT_COLLAPSE_HEADER)).toBeFalsy();
  });

  it('expands default categories', () => {
    const wrapper = mount(
      <DescriptionList
        valueSet={SAMPLE_PROPS}
        toCategory={toCategoryByName}
        expandedCategories={['2']}
      />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_CONTENT)
        .find('dt')
        .text()
    ).toEqual('3');
  });

  it('renders uncategorised items', () => {
    const uncategorisedProp = 'latestUpdateTimeSource';
    const unknownCategory = 'extra';
    const all = 'all';
    const toCategory = (name: string) =>
      name !== uncategorisedProp ? all : undefined;
    const wrapper = mount(
      <DescriptionList
        valueSet={ASSET_DATA.metadata}
        toCategory={toCategory}
        unknownCategoryName={unknownCategory}
        expandedCategories={[unknownCategory, all]}
      />
    );
    expect(
      wrapper.find(ANT_COLLAPSE_HEADER).map(expand => expand.text())
    ).toEqual([all, unknownCategory]);
    expect(
      wrapper
        .find(ANT_COLLAPSE_CONTENT)
        .at(1)
        .find('dt')
        .text()
    ).toEqual(uncategorisedProp);
  });
});
