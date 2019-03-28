import React from 'react';
import { storiesOf } from '@storybook/react';
import AssetEventsPanel from 'components/AssetEventsPanel/AssetEventsPanel';
import { EVENTS } from 'mocks/events';

storiesOf('AssetEventsPanel', module)
  .addParameters({
    info: {
      inline: true,
      maxPropObjectKeys: 10,
    },
  })
  .add('Minimal', () => <AssetEventsPanel events={EVENTS} />)
  .add('Empty table', () => <AssetEventsPanel events={[]} />)
  .add('Events not set', () => <AssetEventsPanel />)
  .add('Pagination on top', () => (
    <AssetEventsPanel events={EVENTS} pagination={{ position: 'top' }} />
  ))
  .add('Pagination top and bottom', () => (
    <AssetEventsPanel events={EVENTS} pagination={{ position: 'both' }} />
  ))
  .add('Items per page', () => (
    <AssetEventsPanel events={EVENTS} pagination={{ pageSize: 2 }} />
  ))
  .add('Let user select pagesize', () => (
    <AssetEventsPanel events={EVENTS} pagination={{ showSizeChanger: true }} />
  ))
  .add('Hide headers', () => (
    <AssetEventsPanel events={EVENTS} showHeader={false} />
  ))
  .add('Borders in table', () => (
    <AssetEventsPanel events={EVENTS} bordered={true} />
  ))
  .add('Custom styling', () => (
    <AssetEventsPanel
      events={EVENTS}
      style={{
        border: '2px dashed red',
        padding: '0 6px',
      }}
    />
  ))
  .add('Define other columns', () => (
    <AssetEventsPanel
      events={EVENTS}
      columns={[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Start',
          dataIndex: 'start',
          key: 'start',
        },
      ]}
    />
  ));
