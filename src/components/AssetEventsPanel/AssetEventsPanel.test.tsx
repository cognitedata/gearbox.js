import { configure, mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { AssetEventsPanel } from './AssetEventsPanel';
import { EVENTS } from '../../mocks';

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
