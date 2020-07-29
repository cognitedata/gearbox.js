// Copyright 2020 Cognite AS
import { Input } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { SearchValue } from '../../../../mocks';
import { defaultStrings, SearchForm } from './SearchForm';

configure({ adapter: new Adapter() });

const propsCallbacks = {
  onChange: jest.fn(),
  onPressEnter: jest.fn(),
  onSubmit: jest.fn(),
};

describe('Search', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<SearchForm value={null} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Check onSubmit callback triggering on form submit', () => {
    const { search } = defaultStrings;
    const { onSubmit } = propsCallbacks;
    const props = { value: null, onSubmit };
    const wrapper = mount(<SearchForm {...props} />);

    const submitBtn = wrapper.findWhere(
      n => n.text() === search && n.type() === 'button'
    );

    submitBtn.simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('Check metadata fields adding', () => {
    const props = { value: null };
    const wrapper = mount(<SearchForm {...props} />);

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
    const props = { value: SearchValue };
    const wrapper = mount(<SearchForm {...props} />);

    expect(wrapper.find('input[name="name"]').prop('value')).toEqual(
      SearchValue.name
    );
    expect(wrapper.find('input[name="description"]').prop('value')).toEqual(
      SearchValue.description
    );
  });

  it('Should call onPressEnter on enter', () => {
    const props = {
      value: SearchValue,
      onPressEnter: propsCallbacks.onPressEnter,
    };
    const wrapper = mount(<SearchForm {...props} />);

    // @ts-ignore
    wrapper
      .find(Input)
      .first()
      .props()
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .onPressEnter({ preventDefault: () => {} });

    expect(propsCallbacks.onPressEnter).toHaveBeenCalled();
  });

  it('Should call onChange on form change', () => {
    const { onChange } = propsCallbacks;
    const props = { value: null, onChange };
    const wrapper = mount(<SearchForm {...props} />);
    wrapper
      .find(Input)
      .find('.name')
      .first()
      .simulate('change', { target: { value: 'name' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('Should return fields on submit', () => {
    const props = {
      value: null,
      onSubmit: propsCallbacks.onSubmit,
    };
    const { search } = defaultStrings;
    const wrapper = mount(<SearchForm {...props} />);

    wrapper
      .find(Input)
      .find('.name')
      .first()
      .simulate('change', { target: { value: 'name' } });
    wrapper
      .find(Input)
      .find('.description')
      .first()
      .simulate('change', { target: { value: 'description' } });

    wrapper
      .find(Input)
      .find('.meta-key')
      .first()
      .simulate('change', { target: { value: 'metaId' } });

    wrapper
      .find(Input)
      .find('.meta-value')
      .first()
      .simulate('change', { target: { value: 'metaValue' } });

    const submitBtn = wrapper.findWhere(
      n => n.text() === search && n.type() === 'button'
    );

    submitBtn.simulate('submit');
    expect(propsCallbacks.onSubmit).toHaveBeenCalled();
    expect(propsCallbacks.onSubmit).toHaveBeenCalledWith({
      name: 'name',
      description: 'description',
      metadata: [{ id: expect.any(String), key: 'metaId', value: 'metaValue' }],
    });
  });
});
