import { Event } from '@cognite/sdk';
import { Icon, Modal, Table } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import { AssetEventsPanelProps } from '../../../interfaces';
import { momentFromTimestamp } from '../../../utils/formatters';

interface EventAddonsProp extends Event {
  typeAndSubtype: React.ReactNode;
  start: string;
  end: string;
}

interface AssetEventsPanelState {
  selectedEvent: EventAddonsProp | null;
}

export class AssetEventsPanel extends Component<
  AssetEventsPanelProps,
  AssetEventsPanelState
> {
  constructor(props: AssetEventsPanelProps) {
    super(props);
    this.state = {
      selectedEvent: null,
    };
  }

  getTableComponents() {
    const { styles } = this.props;

    return {
      body: {
        row: (props: any) => {
          return (
            <StyledRow style={styles && styles.tableRow}>
              {props.children}
            </StyledRow>
          );
        },
        cell: (props: any) => {
          return (
            <StyledCell style={styles && styles.tableCell}>
              {props.children}
            </StyledCell>
          );
        },
      },
    };
  }

  renderEventDetails = (event: EventAddonsProp) => (
    <EventDetails key="event-detail">
      <div key="event-type">
        <strong>{event.type},</strong> {event.subtype}
      </div>
      {event.description && (
        <div className="description">{event.description}</div>
      )}
      <div key="event-time" className="times">
        <span>{event.start}</span>
        <span>
          <Icon type="right" />
        </span>
        <span style={{ textAlign: 'right' }}>{event.end}</span>
      </div>
    </EventDetails>
  );

  renderEventMetadata = (event: EventAddonsProp) => (
    <EventMetadataList key="event-metadata">
      {Object.keys(event.metadata || {}).map(key => (
        <div key={key} className="event-metadata">
          <strong>{key}</strong> <br />
          <span>{event.metadata && event.metadata[key]}</span>
        </div>
      ))}
    </EventMetadataList>
  );

  mapEvent = (event: Event): EventAddonsProp => ({
    ...event,
    typeAndSubtype: (
      <span>
        <strong style={{ display: 'block' }}>{event.type}</strong>
        <span style={{ fontSize: 12, opacity: 0.8 }}>{event.subtype}</span>
      </span>
    ),
    description: event.description || 'No description',
    start:
      typeof event.startTime === 'number'
        ? momentFromTimestamp(event.startTime).format('LLL')
        : '-',
    end:
      typeof event.endTime === 'number'
        ? momentFromTimestamp(event.endTime).format('LLL')
        : 'Ongoing',
  });

  onEventClick = (record: EventAddonsProp) => {
    this.setState({
      selectedEvent: record,
    });
  };

  render() {
    const defaultColumns = [
      {
        title: 'Type / Subtype',
        dataIndex: 'typeAndSubtype',
        key: 'typeAndSubtype',
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
      {
        title: 'End',
        dataIndex: 'end',
        key: 'end',
      },
    ];

    const {
      columns = defaultColumns,
      events = [],
      pagination = { pageSize: 12 },
      scroll,
      bordered = false,
      showHeader = true,
      styles,
    } = this.props;

    const { selectedEvent } = this.state;

    console.log(this.getTableComponents().body.cell);

    return (
      <>
        <StyledTable
          key="styleTable"
          columns={columns}
          dataSource={events.map(this.mapEvent)}
          rowKey="id"
          showHeader={showHeader}
          pagination={pagination}
          scroll={scroll}
          bordered={bordered}
          components={this.getTableComponents()}
          style={styles && styles.table}
          onRow={record => ({
            onClick: () => this.onEventClick(record as EventAddonsProp),
          })}
        />
        {!!selectedEvent && (
          <Modal
            key="Modal"
            visible={!!selectedEvent}
            footer={null}
            onCancel={() => this.setState({ selectedEvent: null })}
          >
            {!!selectedEvent && [
              this.renderEventDetails(selectedEvent),
              this.renderEventMetadata(selectedEvent),
            ]}
          </Modal>
        )}
      </>
    );
  }
}

const StyledTable = styled(Table)``;

const StyledRow = styled.tr`
  background: white;
  cursor: pointer;
  &:nth-child(2n) {
    background: #fafafa;
  }
`;

const StyledCell = styled.td`
  max-width: 500px;
`;

const EventDetails = styled.div`
  .description {
    font-size: 18px;
    padding-top: 16px;
  }
  .times {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
  }
`;

const EventMetadataList = styled.div`
  margin-top: 32px;
  max-height: calc(100vh - 400px);
  overflow: auto;
  .event-metadata {
    padding: 16px;
    &:nth-child(2n) {
      background: #fbfbfb;
    }
  }
`;
