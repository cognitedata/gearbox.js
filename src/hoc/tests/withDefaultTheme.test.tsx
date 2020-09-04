// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { withDefaultTheme } from '../withDefaultTheme';

configure({ adapter: new Adapter() });

describe('WithDefaultTheme', () => {
  it('should return wraped component ', () => {
    class ExampleComponent extends React.Component {
      render() {
        return <div> Test Content</div>;
      }
    }

    const WrappedComponent = withDefaultTheme(ExampleComponent);
    const wrapper = mount(<WrappedComponent />);

    expect(wrapper.html()).toBe('<div> Test Content</div>');
  });
});
