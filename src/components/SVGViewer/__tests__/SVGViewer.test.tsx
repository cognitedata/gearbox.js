import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { SVGViewer } from '../SVGViewer';

configure({ adapter: new Adapter() });

describe('SVGViewer', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<SVGViewer documentId={0} />);
    expect(wrapper).toHaveLength(1);
  });
});
