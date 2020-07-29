// Copyright 2020 Cognite AS
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getScaleTime } from '../helpers';
import { getCogniteEventsForTimeline, timelineEvents } from '../mocks/events';
import { end, start } from '../mocks/time';
import { TimelineProps } from './interfaces';

import { Timeline } from './Timeline';

configure({ adapter: new Adapter() });

let wrapper: ReactWrapper;
const width = 500;
const height = 80;
const color = '#000';
const events = getCogniteEventsForTimeline(timelineEvents);
const scale = getScaleTime(width, start, end);

const defaultProps: TimelineProps = {
  width,
  height,
  events,
  color,
  index: 1,
  scale,
};

const ComponentWrapper: React.FC<TimelineProps> = props => (
  <svg>
    <Timeline {...props} />
  </svg>
);

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);
});

afterEach(() => {
  wrapper.unmount();
});

describe('Ruler', () => {
  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(<ComponentWrapper {...defaultProps} />);
    });

    expect(wrapper.exists()).toBeTruthy();
  });
  it('should calculate position with padding', async () => {
    const padding = 20;
    const { height: dHeight, index } = defaultProps;
    const y = index * (dHeight + padding) + dHeight;

    await act(async () => {
      wrapper = mount(<ComponentWrapper {...{ ...defaultProps, padding }} />);
    });

    expect(
      wrapper
        .find(Timeline)
        .getDOMNode()
        .getAttribute('transform')
    ).toEqual(`translate(0, ${y})`);
  });
});
