import React, { SyntheticEvent } from 'react';
import { configure, mount } from 'enzyme';
import { EventPreview, defaultStrings } from './EventPreview';
import { EVENTS, eventWithout, eventPreviewStrings } from '../../mocks';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const event = EVENTS[0];
const onShowDetails = (e: SyntheticEvent) => e;

describe('EventPreview', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <EventPreview event={event} onShowDetails={onShowDetails} strings={{}} />
    );
    expect(wrapper).toHaveLength(1);
  });

  it('Render "0" value in case of missing "metadata" property in event', () => {
    const missingMetadataEvent = eventWithout('metadata');
    const wrapper = mount(
      <EventPreview
        event={missingMetadataEvent}
        onShowDetails={onShowDetails}
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
      <EventPreview
        event={missingDescriptionEvent}
        onShowDetails={onShowDetails}
        strings={eventPreviewStrings}
      />
    );

    const { noDescription } = eventPreviewStrings;
    expect(wrapper.contains(noDescription)).toBeTruthy();
  });

  it('Applies default strings in case of undefined "strings" property', () => {
    const missingMetadataEvent = eventWithout('description');
    const wrapper = mount(
      <EventPreview
        event={missingMetadataEvent}
        onShowDetails={onShowDetails}
      />
    );

    const { noDescription } = defaultStrings;
    expect(wrapper.contains(noDescription as string)).toBeTruthy();
  });
});
