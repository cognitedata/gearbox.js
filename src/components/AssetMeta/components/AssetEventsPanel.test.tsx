import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { EVENTS } from '../../../mocks';
import { AssetEventsPanel } from './AssetEventsPanel';

configure({ adapter: new Adapter() });

describe('AssetEventsPanel', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<AssetEventsPanel events={EVENTS} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('checks if the modal is opened', () => {
    const EventPanelModal = mount(<AssetEventsPanel events={EVENTS} />);

    expect(EventPanelModal.state('selectedEvent')).toEqual(null);

    const clickableRow = EventPanelModal.find('td').first();
    clickableRow.simulate('click');
    expect(typeof EventPanelModal.state('selectedEvent')).toBe('object');
  });
});
