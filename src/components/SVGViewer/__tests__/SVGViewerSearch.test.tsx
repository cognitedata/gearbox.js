import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import SVGViewerSearch from '../SVGViewerSearch';

configure({ adapter: new Adapter() });

describe('SVGViewerSearch', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <SVGViewerSearch
        visible={true}
        svg={document.createElementNS('http://www.w3.org/2000/svg', 'svg')}
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
});
