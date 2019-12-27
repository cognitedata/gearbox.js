// should be placed before EventTimeline import
jest.mock('d3', () => ({
  event: {
    type: 'zoom',
    transform: {
      rescaleX: () => ({ domain: () => [new Date(), new Date()] }),
    },
  },
}));

import * as zoom from 'd3-zoom';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { baseTimestamp, fakeEvents } from '../../mocks';
import { MockCogniteClient } from '../../mocks/mockSdk';
import { ClientSDKProvider } from '../ClientSDKProvider';
import {
  CogniteEventForTimeline,
  EventTimelineView,
  TimelineRuler,
  TimelineSize,
} from './components';
import { EventsTimeline, EventsTimelineProps } from './EventsTimeline';
import { timelineEvents } from './mocks/events';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  events: any = {
    retrieve: jest.fn(),
  };
}

let wrapper: ReactWrapper;
let zoomEvents: any = {};

const sdk = new CogniteClient({ appId: 'gearbox test' });
const start = baseTimestamp;
const end = baseTimestamp + 30 * 24 * 60 * 60 * 1000;

const defaultProps = {
  start,
  end,
  events: timelineEvents,
};

const ComponentWrapper: React.FC<EventsTimelineProps> = props => (
  <ClientSDKProvider client={sdk}>
    <EventsTimeline {...props} />
  </ClientSDKProvider>
);

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);

  sdk.events.retrieve.mockImplementation(async (ids: { id: number }[]) => {
    return ids.map(({ id }) => fakeEvents.find(e => e.id === id));
  });

  jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
    f.flush = () => undefined;

    return f;
  });

  jest.spyOn(zoom, 'zoom').mockImplementation((): any => {
    const self: any = {};

    self.scaleExtent = () => self;
    self.on = jest.fn().mockImplementation((name: string, fn: any) => {
      zoomEvents[name] = fn;

      return self;
    });
    self.apply = jest.fn();

    return self;
  });
});

afterEach(() => {
  jest.clearAllMocks();
  wrapper.unmount();
  zoomEvents = {};
});

afterAll(() => {
  jest.resetModules();
});

describe('EventsTimeline', () => {
  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(<ComponentWrapper {...defaultProps} />);
    });

    expect(wrapper.exists()).toBeTruthy();
    expect(sdk.events.retrieve).toHaveBeenCalled();
  });
  it('should call zoom callback if provided', async () => {
    const onZoomStart = jest.fn();
    const onZoom = jest.fn();
    const onZoomEnd = jest.fn();
    const zoomConf = {
      enable: true,
      onZoomStart,
      onZoom,
      onZoomEnd,
    };
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper {...{ ...defaultProps, zoom: zoomConf }} />
      );
    });

    wrapper.update();

    zoomEvents.start();

    await act(async () => {
      zoomEvents.zoom();
    });

    zoomEvents.end();

    expect(onZoomStart).toHaveBeenCalled();
    expect(onZoom).toHaveBeenCalled();
    expect(onZoomEnd).toHaveBeenCalled();
  });
  it('should render dates if dateFormatter is provided', async () => {
    const formattedDate = '01 Jan';
    const dateFormatter = (_: number) => formattedDate;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper {...{ ...defaultProps, dateFormatter }} />
      );
    });

    const dates = wrapper.find('div[data-test-id="dates"]');

    expect(dates.exists()).toBeTruthy();
    expect(
      dates
        .find('span')
        .first()
        .text()
    ).toEqual(formattedDate);
  });
  it('should split events between timelines if toTimelines is defined', async () => {
    const height = 20;
    const bottom = 20;
    const toTimelines = jest
      .fn()
      .mockImplementation(({ appearance: { view } }: CogniteEventForTimeline) =>
        view === EventTimelineView.outline ? '#000' : '#999'
      );
    const timelineSize: TimelineSize = { height, bottom };

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper {...{ ...defaultProps, toTimelines, timelineSize }} />
      );
    });

    wrapper.update();

    expect(toTimelines).toHaveBeenCalledTimes(2);
    expect(
      wrapper
        .find('svg')
        .getDOMNode()
        .getAttribute('height')
    ).toEqual((2 * (height + bottom)).toString());
  });
  it('should render ruler if ruler config is provided', async () => {
    const ruler: TimelineRuler = {
      show: true,
    };

    await act(async () => {
      wrapper = mount(<ComponentWrapper {...{ ...defaultProps, ruler }} />);
    });

    wrapper.update();

    expect(wrapper.find('g[data-test-id="ruler"]').exists()).toBeTruthy();
  });
});
