import { configure, mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import AssetEventsPanel from 'components/AssetEventsPanel/AssetEventsPanel';
import { EVENTS } from 'mocks/events';

configure({ adapter: new Adapter() });

describe('TenantSelector', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<AssetEventsPanel events={EVENTS} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('checks if the modal is opened', () => {
    const EventPanelModal = mount(<AssetEventsPanel events={EVENTS} />);

    expect(typeof EventPanelModal.state('hasSelectedEvent')).toBe('boolean');

    const clickableRow = EventPanelModal.find('td').first();
    clickableRow.simulate('click');
    expect(typeof EventPanelModal.state('hasSelectedEvent')).toBe('object');
  });
});
