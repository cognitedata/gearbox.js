import { Event as ApiEvent } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { eventPreviewStrings, EVENTS, eventWithout } from '../../../mocks';
import { defaultStrings, EventPreviewView } from './EventPreviewView';

configure({ adapter: new Adapter() });

const event = EVENTS[0];

describe('EventPreview', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<EventPreviewView event={event} strings={{}} />);
    expect(wrapper).toHaveLength(1);
  });

  it('Render "0" value in case of missing "metadata" property in event', () => {
    const missingMetadataEvent = eventWithout('metadata');
    const wrapper = mount(
      <EventPreviewView
        event={(missingMetadataEvent as any) as ApiEvent}
        strings={eventPreviewStrings}
      />
    );

    let { metadataSummary } = eventPreviewStrings;
    metadataSummary = metadataSummary.replace('{{count}}', '0');

    expect(wrapper.contains(metadataSummary)).toBeTruthy();
  });

  it('Renders right without "description" field in "event" property', () => {
    const missingDescriptionEvent = eventWithout('description');
    const wrapper = mount(
      <EventPreviewView
        event={(missingDescriptionEvent as any) as ApiEvent}
        strings={eventPreviewStrings}
      />
    );

    const { noDescription } = eventPreviewStrings;
    expect(wrapper.contains(noDescription)).toBeTruthy();
  });

  it('Applies default strings in case of undefined "strings" property', () => {
    const missingMetadataEvent = eventWithout('description');
    const wrapper = mount(
      <EventPreviewView event={(missingMetadataEvent as any) as ApiEvent} />
    );

    const { noDescription } = defaultStrings;
    expect(wrapper.contains(noDescription as string)).toBeTruthy();
  });

  it('Should not render type and subtype', () => {
    const wrapper = mount(
      <EventPreviewView event={event} hideProperties={['type', 'subtype']} />
    );
    const text = wrapper.text();
    expect(text.indexOf(event.type!)).toBe(-1);
    expect(text.indexOf(event.subtype!)).toBe(-1);
  });
});
