import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { ASSET_META_EVENTS_STYLES, EVENTS } from '../../../mocks';
import { AssetEventsPanel } from './AssetEventsPanel';

configure({ adapter: new Adapter() });

describe('AssetEventsPanel', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<AssetEventsPanel events={EVENTS} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('checks if the modal is opened', done => {
    const eventPanelModal = mount(<AssetEventsPanel events={EVENTS} />);

    expect(eventPanelModal.state('selectedEvent')).toEqual(null);

    const clickableRow = eventPanelModal.find('td').first();
    clickableRow.simulate('click');
    setImmediate(() => {
      eventPanelModal.update();
      const modalWindow = eventPanelModal.find('Modal');
      expect(modalWindow).toHaveLength(1);
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
        <AssetEventsPanel events={EVENTS} styles={ASSET_META_EVENTS_STYLES} />
      );
      const containerStyle = eventPanel
        .find(element)
        .last()
        .prop('style');

      expect(inlineStyle === containerStyle).toBeTruthy();
    }
  );
});
