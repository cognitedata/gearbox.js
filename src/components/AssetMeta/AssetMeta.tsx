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

const { TabPane } = Tabs;

interface AssetMetaTypes {
  asset: Asset;
  tab?: string;
  docsProps?: DocumentTableProps;
  eventProps?: AssetEventsPanelProps;
  hidePanels?: AssetPanelType[];
  onPaneChange?: (key: string) => void;
}

export const AssetMeta = (props: AssetMetaTypes) => {
  const {
    asset,
    tab: propsTab,
    docsProps,
    eventProps,
    hidePanels,
    onPaneChange,
  } = props;

  const tab =
    propsTab === 'docs' || propsTab === 'events' ? propsTab : 'details';

  const includesPanel = (pane: AssetPanelType) =>
    hidePanels ? hidePanels.indexOf(pane) < 0 : true;

  return (
    <>
      <h3>{asset.name ? asset.name : asset.id}</h3>
      {asset.description && <p>{asset.description}</p>}

      <Tabs defaultActiveKey={tab} onChange={onPaneChange}>
        {asset.metadata && includesPanel('details') && (
          <TabPane tab="Details" key="details">
            <DescriptionList valueSet={asset.metadata} />
          </TabPane>
        )}
        {docsProps && includesPanel('documents') && (
          <TabPane tab="Documents" key="documents">
            <DocumentTable {...docsProps} />
          </TabPane>
        )}
        {eventProps && includesPanel('events') && (
          <TabPane tab="Events" key="events">
            <AssetEventsPanel {...eventProps} />
          </TabPane>
        )}
      </Tabs>
    </>
  );
};

AssetMeta.displayName = 'AssetMeta';
