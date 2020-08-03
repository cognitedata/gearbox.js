// Copyright 2020 Cognite AS
import { mount } from 'enzyme';
import React from 'react';
import {
  WebcamCropPlaceholder,
  WebcamCropPlaceholderProps,
} from './WebcamCropPlaceholder';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('WebcampCropPlaceholder', () => {
  it('Should render without exploding, and find the cropper-placeholder element', () => {
    const props: WebcamCropPlaceholderProps = { height: 200, width: 400 };
    const wrapper = mount(<WebcamCropPlaceholder {...props} />);
    expect(
      wrapper.find('[data-test-id="cropper-placeholder"]').hostNodes()
    ).toHaveLength(1);
  });
});
