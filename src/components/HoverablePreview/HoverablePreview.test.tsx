import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { adjustBorders } from './components/HoverablePreviewCell/HoverablePreviewCell';
import { HoverablePreview } from './HoverablePreview';

configure({ adapter: new Adapter() });

const hpDisplayName = '.hp-displayicon';
const hpPreviewName = '.hp-preview';
const hpCellName = '.hp-cell';
const outsideName = '.outside';

describe('HoverablePreview basic', () => {
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
  it('properly gives cell a title', () => {
    const wrapper = mount(
      <HoverablePreview>
        <HoverablePreview.Cell title="with title">
          Cell with title
        </HoverablePreview.Cell>
        <HoverablePreview.Cell>Cell without title</HoverablePreview.Cell>
      </HoverablePreview>
    );
    expect(
      wrapper
        .find(hpCellName)
        .at(0)
        .find('.hp-cell-title')
        .exists()
    ).toBeTruthy();
    expect(
      wrapper
        .find(hpCellName)
        .at(4)
        .find('.hp-cell-title')
        .exists()
    ).not.toBeTruthy();
  });
  it('animates correctly', () => {
    const wrapper = mount(
      <div className="test">
        Hover me
        <HoverablePreview displayOn="hover" fadeIn={true}>
          <HoverablePreview.Header>
            <HoverablePreview.Title>Test</HoverablePreview.Title>
            <HoverablePreview.CloseButton />
          </HoverablePreview.Header>
        </HoverablePreview>
      </div>
    );
    const displayIcon = wrapper.find(hpDisplayName).at(0);
    displayIcon.simulate('mouseover');

    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });
  });
  it('removes shadow correctly', () => {
    const wrapper = mount(
      <div className="test">
        Hover me
        <HoverablePreview noShadow={true}>test</HoverablePreview>
      </div>
    );
    const element = wrapper.find(hpPreviewName).at(0);
    expect(
      getComputedStyle(element.getDOMNode()).getPropertyValue('box-shadow')
    ).toBe('');
  });
  it('properly aligns cells', () => {
    const wrapper = mount(
      <HoverablePreview>
        <HoverablePreview.Cell align="right">Right cell</HoverablePreview.Cell>
        <HoverablePreview.Cell>Center cell</HoverablePreview.Cell>
        <HoverablePreview.Cell align="left">Left cell</HoverablePreview.Cell>
      </HoverablePreview>
    );
    const propWidth = 'width';
    const propMargin = 'margin-left';

    const cellRight = wrapper.find(hpCellName).at(0);
    expect(
      getComputedStyle(cellRight.getDOMNode()).getPropertyValue(propWidth)
    ).toBe('50%');
    expect(
      getComputedStyle(cellRight.getDOMNode()).getPropertyValue(propMargin)
    ).toBe('auto');

    const cellCenter = wrapper.find(hpCellName).at(4);
    expect(
      getComputedStyle(cellCenter.getDOMNode()).getPropertyValue(propWidth)
    ).toBe('100%');
    expect(
      getComputedStyle(cellCenter.getDOMNode()).getPropertyValue(propMargin)
    ).toBe('');

    const cellLeft = wrapper.find(hpCellName).at(7);
    expect(
      getComputedStyle(cellLeft.getDOMNode()).getPropertyValue(propWidth)
    ).toBe('50%');
    expect(
      getComputedStyle(cellLeft.getDOMNode()).getPropertyValue(propMargin)
    ).toBe('');
  });
  it('adds required borders correctly', () => {
    const wrapper = mount(
      <div className="test">
        <HoverablePreview>
          <HoverablePreview.Cell borders={['top', 'bottom']}>
            Test
          </HoverablePreview.Cell>
        </HoverablePreview>
      </div>
    );

    const element = wrapper.find(hpCellName).at(0);
    expect(
      getComputedStyle(element.getDOMNode()).getPropertyValue('border-style')
    ).toBe('solid none solid none');
  });
  it('properly adjusts borders', () => {
    const onlyTop = adjustBorders(['top']);
    const leftRight = adjustBorders(['left', 'right']);
    const allFour = adjustBorders(['left', 'right', 'top', 'bottom']);

    expect(onlyTop).toContain('border-style: solid none none none;');
    expect(leftRight).toContain('border-style: none solid none solid;');
    expect(allFour).toContain('border-style: solid solid solid solid;');
  });
});

describe('HoverablePreview - events', () => {
  const events: any = {};

  beforeEach(() => {
    document.addEventListener = jest.fn((event, cb) => {
      events[event] = cb;
    });
  });
  afterEach(() => {
    document.removeEventListener = jest.fn((event, cb) => {
      events[event] = cb;
    });
  });

  it('appears on hover and perishes correctly', () => {
    const wrapper = mount(
      <div className="test">
        Hover me
        <HoverablePreview displayOn="hover">test</HoverablePreview>
      </div>
    );
    const instance: HoverablePreview = wrapper
      .find(HoverablePreview)
      .instance() as HoverablePreview;
    const isShown = jest.spyOn(instance, 'isShown');
    const displayIcon = wrapper.find(hpDisplayName).at(0);

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
        <HoverablePreview displayOn="click">test</HoverablePreview>
      </div>
    );
    const instance: HoverablePreview = wrapper
      .find(HoverablePreview)
      .instance() as HoverablePreview;
    const isShown = jest.spyOn(instance, 'isShown');
    const displayIcon = wrapper.find(hpDisplayName).at(0);
    const hpPreview = wrapper.find(hpPreviewName).at(0);

    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });

    displayIcon.simulate('click');
    expect(isShown).toBeCalledTimes(1);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });

    hpPreview.simulate('click');
    expect(isShown).toBeCalledTimes(1);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });

    displayIcon.simulate('click');
    expect(isShown).toBeCalledTimes(2);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });
  });

  it('appears on click and perishes correctly after clicking outside', () => {
    const wrapper = mount(
      <div className="outside" style={{ width: '100vw', height: '100vh' }}>
        Click me!
        <HoverablePreview displayOn="click">test</HoverablePreview>
      </div>
    );
    const instance: HoverablePreview = wrapper
      .find(HoverablePreview)
      .instance() as HoverablePreview;
    const isShown = jest.spyOn(instance, 'isShown');
    const displayIcon = wrapper.find(hpDisplayName).at(0);

    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });

    displayIcon.simulate('click');
    expect(isShown).toBeCalledTimes(1);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: true,
    });

    events.click(outsideName);
    expect(isShown).toBeCalledTimes(2);
    expect(wrapper.find(HoverablePreview).state()).toMatchObject({
      show: false,
    });
  });
});
