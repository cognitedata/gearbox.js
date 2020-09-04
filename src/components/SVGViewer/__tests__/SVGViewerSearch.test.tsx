// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import SVGViewerSearch from '../SVGViewerSearch';

configure({ adapter: new Adapter() });

const propsCallBacks = {
  addCssClassesToMetadataContainer: jest.fn(),
  addCssClassesToSvgText: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
});
const svgSource = 'http://www.w3.org/2000/svg';
describe('SVGViewerSearch', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <SVGViewerSearch
        visible={true}
        svg={document.createElementNS(svgSource, 'svg')}
        isDesktop={true}
        openSearch={() => null}
        zoomOnCurrentAsset={() => null}
        handleCancelSearch={() => null}
        addCssClassesToMetadataContainer={() => null}
        addCssClassesToSvgText={() => null}
        onFocus={() => null}
        onBlur={() => null}
      />
    );
    expect(wrapper).toHaveLength(1);
  });

  it('should add css classes to metadata container', () => {
    const { addCssClassesToMetadataContainer } = propsCallBacks;
    const wrapper = mount(
      <SVGViewerSearch
        visible={true}
        svg={document.createElementNS(svgSource, 'svg')}
        isDesktop={true}
        openSearch={() => null}
        zoomOnCurrentAsset={() => null}
        handleCancelSearch={() => null}
        addCssClassesToMetadataContainer={addCssClassesToMetadataContainer}
        addCssClassesToSvgText={() => null}
        onFocus={() => null}
        onBlur={() => null}
      />
    );
    // @ts-ignore
    wrapper
      .find('input')
      .first()
      .props()
      // @ts-ignore
      .onChange({ currentTarget: { value: 'svg' } });
    expect(addCssClassesToMetadataContainer).toHaveBeenCalled();
  });

  it('should add css classes to svg text', () => {
    const { addCssClassesToSvgText } = propsCallBacks;
    const wrapper = mount(
      <SVGViewerSearch
        visible={true}
        svg={document.createElementNS(svgSource, 'svg')}
        isDesktop={true}
        openSearch={() => null}
        zoomOnCurrentAsset={() => null}
        handleCancelSearch={() => null}
        addCssClassesToMetadataContainer={() => null}
        addCssClassesToSvgText={addCssClassesToSvgText}
        onFocus={() => null}
        onBlur={() => null}
      />
    );
    // @ts-ignore
    wrapper
      .find('input')
      .first()
      .props()
      // @ts-ignore
      .onChange({ currentTarget: { value: 'svg' } });
    expect(addCssClassesToSvgText).toHaveBeenCalled();
  });
});
