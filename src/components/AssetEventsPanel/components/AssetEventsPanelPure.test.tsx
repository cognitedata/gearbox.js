// Copyright 2020 Cognite AS
import { CogniteEvent } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ASSET_META_EVENTS_STYLES, fakeEvents } from '../../../mocks';
import { EventAddonsProp, EventMetadataRenderer } from '../interfaces';
import {
  AssetEventsPanelPure,
  AssetEventsPanelPureComponent,
} from './AssetEventsPanelPure';

configure({ adapter: new Adapter() });

describe('AssetEventsPanel', () => {
  it('checks if the modal is opened', done => {
    const eventPanelModal = mount(
      <AssetEventsPanelPure assetEvents={fakeEvents} />
    );

    expect(
      eventPanelModal.find(AssetEventsPanelPureComponent).state('selectedEvent')
    ).toEqual(null);

    const clickableRow = eventPanelModal.find('td').first();
    clickableRow.simulate('click');
    setImmediate(() => {
      eventPanelModal.update();
      const modalWindow = eventPanelModal.find('Modal');
      expect(modalWindow).toHaveLength(1);
      done();
    });
  });

  it('should allow custom rendering of metadata', done => {
    const assetEvents = fakeEvents;

    const eventCssId = (event: CogniteEvent) => `some-${event.id}`;

    const eventMessage = (event: CogniteEvent) => {
      const source = (event.metadata && event.metadata.source) || '';
      return `${source}: lorem-ipsum`;
    };

    const renderEventMetadata: EventMetadataRenderer = (
      event: EventAddonsProp
    ) => (
      <div key={event.id} id={eventCssId(event)}>
        {eventMessage(event)}
      </div>
    );

    const eventPanelModal = mount(
      <AssetEventsPanelPure {...{ assetEvents, renderEventMetadata }} />
    );

    const clickableRow = eventPanelModal.find('td').first();
    clickableRow.simulate('click');

    setImmediate(() => {
      eventPanelModal.update();

      const [firstEvent] = fakeEvents;
      const eventMetadata = eventPanelModal.find(`#${eventCssId(firstEvent)}`);

      const expectedMessage = eventMessage(firstEvent);
      expect(eventMetadata.text()).toEqual(expectedMessage);
      done();
    });
  });

  it.each`
    inlineStyle                           | element
    ${ASSET_META_EVENTS_STYLES.table}     | ${'.ant-table-wrapper'}
    ${ASSET_META_EVENTS_STYLES.tableRow}  | ${'tr'}
    ${ASSET_META_EVENTS_STYLES.tableCell} | ${'td'}
  `(
    'should render component with passed inline styles',
    ({ inlineStyle, element }) => {
      const eventPanel = mount(
        <AssetEventsPanelPure
          assetEvents={fakeEvents}
          styles={ASSET_META_EVENTS_STYLES}
        />
      );
      const containerStyle = eventPanel
        .find(element)
        .last()
        .prop('style');

      expect(inlineStyle === containerStyle).toBeTruthy();
    }
  );
});
