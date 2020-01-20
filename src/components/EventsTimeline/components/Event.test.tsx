import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { baseTimestamp } from '../../../mocks';
import { getScaleTime } from '../helpers';
import { EventTimelineType, EventTimelineView } from '../interfaces';
import { end, start } from '../mocks/time';
import { Event } from './Event';
import { EventProps } from './interfaces';

configure({ adapter: new Adapter() });

let wrapper: ReactWrapper;
const width = 500;
const color = '#000';
const eStart = baseTimestamp + 10 * 24 * 60 * 60 * 1000;
const eEnd = baseTimestamp + 12 * 24 * 60 * 60 * 1000;
const scale = getScaleTime(width, start, end);

const defaultProps: EventProps = {
  color,
  scale,
  start: eStart,
  end: eEnd,
};

const ComponentWrapper: React.FC<EventProps> = props => (
  <svg>
    <Event {...props} />
  </svg>
);

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);
});

afterEach(() => {
  wrapper.unmount();
});

describe('Event', () => {
  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(<ComponentWrapper {...defaultProps} />);
    });

    expect(wrapper.exists()).toBeTruthy();
  });
  it('should render discrete event', async () => {
    const type = EventTimelineType.discrete;
    const discreteWidth = 1;
    const height = 12;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          {...{ ...defaultProps, type, discreteWidth, height }}
        />
      );
    });

    expect(wrapper.find('rect').length).toEqual(1);
    expect(
      wrapper
        .find('rect')
        .getDOMNode()
        .getAttribute('width')
    ).toEqual(discreteWidth.toString());
  });
  it('should render outline styled events', async () => {
    const view = EventTimelineView.outline;
    await act(async () => {
      wrapper = mount(<ComponentWrapper {...{ ...defaultProps, view }} />);
    });

    expect(wrapper.find('rect').length).toEqual(2);
  });
});
