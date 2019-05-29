import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { AssetView } from './AssetView';

configure({ adapter: new Adapter() });

describe('TenantSelector', () => {
  it('Renders without exploding', done => {
    const wrapper = mount(
      <AssetView asset={{ id: 123, name: 'AAI' }} onClose={done.fail} />
    );
    expect(wrapper).toHaveLength(1);
    done();
  });
});
