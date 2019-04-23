import { Asset } from '@cognite/sdk';
import { Tabs } from 'antd';
import React from 'react';
import {
  AssetEventsPanelProps,
  AssetPanelType,
  DocumentTableProps,
} from '../../interfaces';
import { AssetEventsPanel } from '../AssetEventsPanel/AssetEventsPanel';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { DocumentTable } from '../DocumentTable/DocumentTable';
import { retrieveAsset, getAssetEvent, getAssetFiles } from '../../api';
import { MetaDocProps } from '../../interfaces/DocumentTypes';
import { MetaEventsProps } from '../../interfaces/AssetTypes';

const { TabPane } = Tabs;

interface AssetMetaTypes {
  assetId?: number;
  tab?: string;
  docsProps?: MetaDocProps;
  eventProps?: MetaEventsProps;
  hidePanels?: AssetPanelType[];
  onPaneChange?: (key: string) => void;
}

export class AssetMeta extends React.Component<
  AssetMetaTypes,
  {
    asset: Asset | null;
    assetEvents: AssetEventsPanelProps | null;
    docs: DocumentTableProps | null;
  }
> {
  constructor(props: AssetMetaTypes) {
    super(props);
    this.state = {
      asset: null,
      assetEvents: null,
      docs: null,
    };
  }

  componentDidMount() {
    const { eventProps, docsProps } = this.props;
    const id = this.props && this.props.assetId ? this.props.assetId : 0;
    const query = { assetId: id, limit: 1000 };

    retrieveAsset(id).then(asset => {
      this.setState({ asset });
    });
    getAssetEvent(query).then(events => {
      const eventState = eventProps ? { ...eventProps, events } : { events };
      this.setState({ assetEvents: eventState });
    });
    getAssetFiles(query).then(docs => {
      const fileState = docsProps ? { ...docsProps, docs } : { docs };
      this.setState({ docs: fileState });
    });
  }

  tabStyle = (tab: string, contentLen: number) =>
    contentLen > 0 ? (
      <span>{tab}</span>
    ) : (
      <span style={{ color: '#9b9b9b' }}>({tab})</span>
    );

  includesPanel = (pane: AssetPanelType) =>
    this.props.hidePanels ? this.props.hidePanels.indexOf(pane) < 0 : true;

  render() {
    const { tab: propsTab, onPaneChange } = this.props;

    const { asset, assetEvents, docs } = this.state;

    const tab =
      propsTab === 'docs' || propsTab === 'events' ? propsTab : 'details';

    return asset ? (
      <>
        <h3>{asset.name ? asset.name : asset.id}</h3>
        {asset.description && <p>{asset.description}</p>}

        <Tabs defaultActiveKey={tab} onChange={onPaneChange}>
          {asset.metadata && this.includesPanel('details') && (
            <TabPane
              tab={this.tabStyle('Details', Object.keys(asset.metadata).length)}
              key="details"
            >
              <DescriptionList valueSet={asset.metadata} />
            </TabPane>
          )}
          {docs && this.includesPanel('documents') && (
            <TabPane
              tab={this.tabStyle('Documents', docs.docs.length)}
              key="documents"
            >
              <DocumentTable {...docs} />
            </TabPane>
          )}
          {assetEvents && this.includesPanel('events') && (
            <TabPane
              tab={this.tabStyle(
                'Events',
                assetEvents.events ? assetEvents.events.length : 0
              )}
              key="events"
            >
              <AssetEventsPanel {...assetEvents} />
            </TabPane>
          )}
        </Tabs>
      </>
    ) : (
      <p>no Asset</p>
    );
  }
}
