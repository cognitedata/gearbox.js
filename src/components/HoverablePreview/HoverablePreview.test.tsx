import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { HoverablePreview } from './HoverablePreview';

configure({ adapter: new Adapter() });

describe('HoverablePreview', () => {
  let events:any = {};

  beforeEach(() => {
    document.addEventListener = jest.fn((event, cb) => {
      events[event] = cb;
    });
  });

  it('renders correctly', () => {
    const tree = renderer
      .create(
        <HoverablePreview>
            <HoverablePreview.Header>
              <HoverablePreview.Title>Test</HoverablePreview.Title>
              <HoverablePreview.CloseButton />
            </HoverablePreview.Header>
        </HoverablePreview>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('appears on hover and perishes correctly', () => {
    const wrapper = mount(
      <div className="test">
        Hover me
        <HoverablePreview displayOn='hover'>
        </HoverablePreview>
      </div>
    );
    const instance: HoverablePreview = wrapper
      .find(HoverablePreview)
      .instance() as HoverablePreview;
    const isShown = jest.spyOn(instance, 'isShown');
    const displayIcon = wrapper.find(".hp-displayicon").at(0);
    
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });

    displayIcon.simulate('mouseover');
    expect(isShown).toBeCalled();
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });

    displayIcon.simulate('mouseleave');
    expect(isShown).toBeCalled();
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });
  });

  it('appears on click and perishes correctly after clicking displayIcon again', () => {
    const wrapper = mount(
      <div>
        <div className="outside">Click me!</div>
        <HoverablePreview displayOn='click'>
        </HoverablePreview>
      </div>
    );
    const instance: HoverablePreview = wrapper
      .find(HoverablePreview)
      .instance() as HoverablePreview;
    const isShown = jest.spyOn(instance, 'isShown');
    
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });

    wrapper.find(".hp-displayicon").at(0).simulate('click');
    expect(isShown).toBeCalledTimes(1);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });

    wrapper.find(".hp-preview").at(0).simulate('click');
    expect(isShown).toBeCalledTimes(1);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });

    wrapper.find(".hp-displayicon").at(0).simulate('click');
    expect(isShown).toBeCalledTimes(2);    
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });
  });

  it('appears on click and perishes correctly after clicking outside', () => {
    const wrapper = mount(
      <div className="outside" style={{ width: "100vw", height: "100vh"}}>
        Click me!
        <HoverablePreview displayOn='click'>
        </HoverablePreview>
      </div>
    );
    const instance: HoverablePreview = wrapper
      .find(HoverablePreview)
      .instance() as HoverablePreview;
    const isShown = jest.spyOn(instance, 'isShown');
    
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });

    wrapper.find(".hp-displayicon").at(0).simulate('click');
    expect(isShown).toBeCalledTimes(1);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });

    events.click(".outside");
    expect(isShown).toBeCalledTimes(2);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });
    
  });

  it('animates correctly', () => {
    const wrapper = mount(
      <div className="test">
        Hover me
        <HoverablePreview displayOn='hover' fadeIn>
          <HoverablePreview.Header>
            <HoverablePreview.Title>Test</HoverablePreview.Title>
            <HoverablePreview.CloseButton />
          </HoverablePreview.Header>
        </HoverablePreview>
      </div>
    );
    const displayIcon = wrapper.find(".hp-displayicon").at(0);
    displayIcon.simulate('mouseover');

    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });
  });

  it('adds required borders correctly', () => {
    const wrapper = mount(
      <div className="test">
        Hover me
        <HoverablePreview>
          <HoverablePreview.Cell borders={[ 'top', 'bottom' ]}>
            Test
          </HoverablePreview.Cell>
        </HoverablePreview>
      </div>
    );

    const element = wrapper.find(".hp-cell").at(0);
    expect(getComputedStyle(element.getDOMNode()).getPropertyValue("border-style")).toBe("solid none solid none");
  });

  it('removes shadow correctly', () => {
    const wrapper = mount(
      <div className="test">
        Hover me
        <HoverablePreview noShadow>
        </HoverablePreview>
      </div>
    );
    const element = wrapper.find(".hp-preview").at(0);
    expect(getComputedStyle(element.getDOMNode()).getPropertyValue("box-shadow")).toBe("");
  });
})
