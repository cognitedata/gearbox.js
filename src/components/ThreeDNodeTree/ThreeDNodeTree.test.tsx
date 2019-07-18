import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';
import { ThreeDNodeTree } from './ThreeDNodeTree';

configure({ adapter: new Adapter() });

describe('ThreeDNodeTree', () => {
  it('renders without exposion', () => {
    const wrapper = mount(<ThreeDNodeTree modelId={0} revisionId={0} />);

    expect(wrapper).toHaveLength(1);
  });
  it('handles invalid onSelect callback', () => {
    const onSelect = sinon.fake.rejects(new Error('Error'));

    const wrapper = mount(
      <ThreeDNodeTree modelId={0} revisionId={0} onSelect={onSelect} />
    );

    expect(wrapper).toHaveLength(1);
  });
});
