import { mount } from 'enzyme';
import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { WebcamScanner, WebcamScannerProps } from './WebcamScanner';

configure({ adapter: new Adapter() });

const baseProps: WebcamScannerProps = {
  isLoading: false,
  capture: jest.fn(),
  setRef: jest.fn(),
};

describe('WebcamScanner', () => {
  it('Should render without exploding', () => {
    const wrapper = mount(<WebcamScanner {...baseProps} />);
    expect(wrapper).toBeDefined();
  });

  describe('WebcamCropPlaceholder in WebcamScanner logic', () => {
    const cropPlaceholderSelector = '[data-test-id="webcam-crop-placeholder"]';
    it('Should render crop placeholder', () => {
      const props: WebcamScannerProps = {
        ...baseProps,
        cropSize: { height: 400, width: 200 },
      };
      const wrapper = mount(<WebcamScanner {...props} />);
      expect(wrapper.find(cropPlaceholderSelector).hostNodes()).toHaveLength(1);
    });

    it('Should not render crop placeholder', () => {
      const wrapper = mount(<WebcamScanner {...baseProps} />);
      expect(wrapper.find(cropPlaceholderSelector).hostNodes()).toHaveLength(0);
    });

    it('Should hide crop placeholder when image is captured', () => {
      const props: WebcamScannerProps = {
        ...baseProps,
        imageSrc: 'random imageSrc',
        cropSize: { height: 400, width: 200 },
      };
      const wrapper = mount(<WebcamScanner {...props} />);
      expect(wrapper.find(cropPlaceholderSelector).hostNodes()).toHaveLength(0);
    });
  });
});
