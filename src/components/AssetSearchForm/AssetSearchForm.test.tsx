import { mount, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { AssetSearchForm, defaultStrings } from './AssetSearchForm';
import { AssetSearchFormValue } from '../../mocks';

configure({ adapter: new Adapter() });

const propsCallbacks = {
  onChange: jest.fn(),
  onPressEnter: jest.fn(),
  onSubmit: jest.fn(),
};

describe('AssetSearchForm', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<AssetSearchForm value={null} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Check onSubmit callback triggering on form submit', () => {
    const { search } = defaultStrings;
    const { onSubmit } = propsCallbacks;
    const props = { value: null, onSubmit };
    const wrapper = mount(<AssetSearchForm {...props} />);

    const submitBtn = wrapper.findWhere(
      n => n.text() === search && n.type() === 'button'
    );

    submitBtn.simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('Check metadata fields adding', () => {
    const props = { value: null };
    const wrapper = mount(<AssetSearchForm {...props} />);

    const fieldsLenght = wrapper.find('form').children().length;

    wrapper.find('button.add-more-metadata').simulate('click');
    expect(wrapper.find('form').children().length).toEqual(fieldsLenght + 1);
    wrapper
      .find('i.anticon-minus-circle-o')
      .at(0)
      .simulate('click');
    expect(wrapper.find('form').children().length).toEqual(fieldsLenght);
  });

  it('Check predefined data visualization', () => {
    const props = { value: AssetSearchFormValue };
    const wrapper = mount(<AssetSearchForm {...props} />);

    expect(wrapper.find('input[name="name"]').prop('value')).toEqual(
      AssetSearchFormValue.name
    );
    expect(wrapper.find('input[name="description"]').prop('value')).toEqual(
      AssetSearchFormValue.description
    );
  });
});
