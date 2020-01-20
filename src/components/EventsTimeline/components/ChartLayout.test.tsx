import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { TimelineRuler } from '../interfaces';
import { getCogniteEventsForTimeline, timelineEvents } from '../mocks/events';
import { end, start } from '../mocks/time';
import { ChartLayout } from './ChartLayout';
import { ChartLayoutProps } from './interfaces';

configure({ adapter: new Adapter() });

let wrapper: ReactWrapper;
const width = 500;
const height = 80;
const tlHeight = 20;
const tlBottom = 20;

const ComponentWrapper: React.FC<Omit<ChartLayoutProps, 'svg'>> = props => {
  const svg = useRef<SVGSVGElement | null>(null);

  return (
    <svg ref={svg}>
      <ChartLayout svg={svg} {...props} />
    </svg>
  );
};

const events = getCogniteEventsForTimeline(timelineEvents);

const defaultProps: Omit<ChartLayoutProps, 'svg'> = {
  width,
  height,
  start,
  end,
  timelineSize: { height: tlHeight, bottom: tlBottom },
  timelines: {
    '#999': [events[0]],
    '#000': [events[1]],
  },
};

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);
});

afterEach(() => {
  jest.clearAllMocks();
  wrapper.unmount();
});

describe('ChartLayout', () => {
  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(<ComponentWrapper {...defaultProps} />);
    });

    expect(wrapper.exists()).toBeTruthy();
  });
  it('should trigger ruler callbacks if provided', async () => {
    const onChange = jest.fn();
    const onHide = jest.fn();

    const ruler: TimelineRuler = {
      show: true,
      onChange,
      onHide,
    };

    await act(async () => {
      wrapper = mount(<ComponentWrapper {...{ ...defaultProps, ruler }} />);
    });

    const rulerLayout = wrapper.find('g[data-test-id="ruler"] > rect');

    expect(rulerLayout.exists()).toBeTruthy();

    await act(async () => {
      rulerLayout.simulate('mousemove', { nativeEvent: { offsetX: 0 } });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][2].length).toBeTruthy();

    await act(async () => {
      rulerLayout.simulate('mousemove', { nativeEvent: { offsetX: 450 } });
    });

    // in offsetX = 450 position there is no events placed
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][2].length).toBeFalsy();

    await act(async () => {
      rulerLayout.simulate('mouseleave');
    });

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
