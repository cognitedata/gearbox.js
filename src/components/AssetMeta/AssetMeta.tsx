import { Asset, Event, File } from '@cognite/sdk';
import { Spin, Tabs } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { getAssetEvent, getAssetFiles, retrieveAsset } from '../../api';
import {
  AssetEventsPanelProps,
  AssetEventsPanelStyles,
  AssetPanelType,
  DocumentTableProps,
  DocumentTableStyles,
} from '../../interfaces';
import { MetaEventsProps } from '../../interfaces/AssetTypes';
import { MetaDocProps } from '../../interfaces/DocumentTypes';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { AssetEventsPanel } from './components/AssetEventsPanel';
import { DocumentTable } from './components/DocumentTable';

const SpinContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const { TabPane } = Tabs;

export interface AssetMetaStyles {
  header?: React.CSSProperties;
  emptyTab?: React.CSSProperties;
  details?: React.CSSProperties;
  documents?: DocumentTableStyles;
  events?: AssetEventsPanelStyles;
}

interface AssetMetaProps {
  assetId: number;
  tab?: string;
  docsProps?: MetaDocProps;
  eventProps?: MetaEventsProps;
  hidePanels?: AssetPanelType[];
  onPaneChange?: (key: string) => void;
  styles?: AssetMetaStyles;
}

interface AssetMetaState {
  asset: Asset | null;
  assetEvents: AssetEventsPanelProps | null;
  docs: DocumentTableProps | null;
  isLoading: boolean;
}

export class AssetMeta extends React.Component<AssetMetaProps, AssetMetaState> {
  constructor(props: AssetMetaProps) {
    super(props);
    this.state = {
      asset: null,
      assetEvents: null,
      docs: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    const { assetId } = this.props;
    if (assetId) {
      this.loadAll(assetId);
    } else {
      this.setState({
        isLoading: false,
      });
      return;
    }
  }

  componentDidUpdate(prevProps: AssetMetaProps) {
    if (prevProps.assetId !== this.props.assetId) {
      this.setState({
        isLoading: true,
      });
      this.loadAll(this.props.assetId);
    }
  }

  loadAll = async (assetId: number) => {
    const { eventProps, docsProps } = this.props;
    const query = { assetId, limit: 1000 };

    const promises: [
      Promise<Asset>,
      Promise<Event[]> | Promise<null>,
      Promise<File[]> | Promise<null>
    ] = [
      retrieveAsset(assetId),
      this.includesPanel('events')
        ? getAssetEvent(query)
        : Promise.resolve(null),
      this.includesPanel('documents')
        ? getAssetFiles(query)
        : Promise.resolve(null),
    ];

    const [asset, events, docs] = await Promise.all(promises);

    this.setState({
      isLoading: false,
      asset: asset || null,
      assetEvents: events
        ? eventProps
          ? { ...eventProps, events }
          : { events }
        : null,
      docs: docs ? (docsProps ? { ...docsProps, docs } : { docs }) : null,
    });
  };

  tabStyle = (tab: string, contentLen: number) =>
    contentLen > 0 ? (
      <span>{tab}</span>
    ) : (
      <span
        style={
          (this.props.styles && this.props.styles.emptyTab) || {
            color: '#9b9b9b',
          }
        }
      >
        ({tab})
      </span>
    );

  includesPanel = (pane: AssetPanelType): boolean =>
    this.props.hidePanels ? this.props.hidePanels.indexOf(pane) < 0 : true;

  renderDetailsPane() {
    const { styles } = this.props;
    const { asset } = this.state;
    return (
      asset &&
      asset.metadata &&
      this.includesPanel('details') && (
        <TabPane
          tab={this.tabStyle('Details', Object.keys(asset.metadata).length)}
          key="details"
        >
          <DescriptionList
            valueSet={asset.metadata}
            styles={styles && styles.details}
          />
        </TabPane>
      )
    );
  }

  renderDocumentsPane() {
    const { styles } = this.props;
    const { docs } = this.state;
    return (
      docs &&
      this.includesPanel('documents') && (
        <TabPane
          tab={this.tabStyle('Documents', docs.docs.length)}
          key="documents"
        >
          <DocumentTable {...docs} styles={styles && styles.documents} />
        </TabPane>
      )
    );
  }

  renderEventsPane() {
    const { styles } = this.props;
    const { assetEvents } = this.state;
    return (
      assetEvents &&
      this.includesPanel('events') && (
        <TabPane
          tab={this.tabStyle(
            'Events',
            assetEvents.events ? assetEvents.events.length : 0
          )}
          key="events"
        >
          <AssetEventsPanel {...assetEvents} styles={styles && styles.events} />
        </TabPane>
      )
    );
  }

  render() {
    const { styles, tab: propsTab, onPaneChange } = this.props;
    const { asset, isLoading } = this.state;

    if (isLoading) {
      return (
        <SpinContainer>
          <Spin />
        </SpinContainer>
      );
    }

    const tab =
      propsTab === 'documents' || propsTab === 'events' ? propsTab : 'details';

    return asset ? (
      <>
        <Header style={styles && styles.header}>
          <h3>{asset.name ? asset.name : asset.id}</h3>
          {asset.description && <p>{asset.description}</p>}
        </Header>

        <Tabs defaultActiveKey={tab} onChange={onPaneChange}>
          {this.renderDetailsPane()}
          {this.renderDocumentsPane()}
          {this.renderEventsPane()}
        </Tabs>
      </>
    ) : (
      <p>no Asset</p>
    );
  }
}

const Header = styled.div``;
