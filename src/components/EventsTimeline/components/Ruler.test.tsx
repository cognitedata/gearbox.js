import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { EventTimelineRulerProps, Ruler } from './Ruler';

configure({ adapter: new Adapter() });

let wrapper: ReactWrapper;
const width = 500;
const height = 80;

const defaultProps: EventTimelineRulerProps = { width, height };

const ComponentWrapper: React.FC<EventTimelineRulerProps> = props => (
  <svg>
    <Ruler {...props} />
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
  it('should trigger positionChanged if provided', async () => {
    const positionChanged = jest.fn();
    const event = { offsetX: 50 };

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper {...{ ...defaultProps, positionChanged }} />
      );
    });

    const layout = wrapper.find('rect');

    await act(async () => {
      layout.simulate('mousemove', { nativeEvent: event });
    });

    expect(positionChanged).toHaveBeenCalled();
    expect(positionChanged.mock.calls[0][0].nativeEvent).toEqual(event);

    await act(async () => {
      layout.simulate('mouseleave');
    });

    expect(positionChanged).toHaveBeenCalledWith(null);
  });
  it('should render ruler on mousemove', async () => {
    const event = { offsetX: 50 };

    await act(async () => {
      wrapper = mount(<ComponentWrapper {...{ ...defaultProps }} />);
    });

    const layout = wrapper.find('rect');

    await act(async () => {
      layout.simulate('mousemove', { nativeEvent: event });
    });

    wrapper.update();

    expect(wrapper.find('path').exists()).toBeTruthy();
  });
});
