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
import { retrieveAsset } from '../../api';

const { TabPane } = Tabs;

interface AssetMetaTypes {
  assetId?: number;
  asset: Asset;
  tab?: string;
  docsProps?: DocumentTableProps;
  eventProps?: AssetEventsPanelProps;
  hidePanels?: AssetPanelType[];
  onPaneChange?: (key: string) => void;
}

export class AssetMeta extends React.Component<
  AssetMetaTypes,
  { asset: Asset }
> {
  componentDidMount() {
    const id = this.props && this.props.assetId ? this.props.assetId : 0;

    retrieveAsset(id).then(asset => {
      this.setState({ asset });
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
    const { tab: propsTab, docsProps, eventProps, onPaneChange } = this.props;

    const { asset } = this.state | { asset: null };

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
          {docsProps && this.includesPanel('documents') && (
            <TabPane
              tab={this.tabStyle('Documents', docsProps.docs.length)}
              key="documents"
            >
              <DocumentTable {...docsProps} />
            </TabPane>
          )}
          {eventProps && this.includesPanel('events') && (
            <TabPane
              tab={this.tabStyle(
                'Events',
                eventProps.events ? eventProps.events.length : 0
              )}
              tab="Events"
              key="events"
            >
              <AssetEventsPanel {...eventProps} />
            </TabPane>
          )}
        </Tabs>
      </>
    ) : (
      <p>No asset</p>
    );
  }
}
