import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { ASSET_META_STYLES, EVENTS } from '../../../mocks';
import { AssetEventsPanel } from './AssetEventsPanel';

configure({ adapter: new Adapter() });

describe('AssetEventsPanel', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<AssetEventsPanel events={EVENTS} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('checks if the modal is opened', done => {
    const EventPanelModal = mount(<AssetEventsPanel events={EVENTS} />);

    expect(EventPanelModal.state('selectedEvent')).toEqual(null);

    const clickableRow = EventPanelModal.find('td').first();
    clickableRow.simulate('click');
    setImmediate(() => {
      EventPanelModal.update();
      const modalWindow = EventPanelModal.find('Modal');
      expect(modalWindow).toHaveLength(1);
      done();
    });
  });
  it.each`
    inlineStyle                              | expected
    ${'style="width: 80%;"'}                 | ${true}
    ${'style="background: rgb(0, 255, 0);"'} | ${true}
    ${'style="font-style: italic;"'}         | ${true}
  `(
    'should render component with passed inline styles',
    ({ inlineStyle, expected }) => {
      const EventPanel = mount(
        <AssetEventsPanel events={EVENTS} styles={ASSET_META_STYLES.events} />
      );
      const containerTable = EventPanel.find('.ant-table-wrapper')
        .last()
        .html();
      expect(containerTable.includes(inlineStyle)).toBe(expected);
    }
  );
});
