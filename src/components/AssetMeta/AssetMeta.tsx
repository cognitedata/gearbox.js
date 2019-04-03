import React from 'react';
import { Tabs } from 'antd';
import DescriptionList from 'components/DescriptionList/DescriptionList';
import AssetEventsPanel from 'components/AssetEventsPanel/AssetEventsPanel';
import DocumentTable from 'components/DocumentTable/DocumentTable';
import {
  AssetEventsPanelProps,
  AssetType,
  assetPanels,
  DocumentTableProps,
} from 'utils/validators';

const { TabPane } = Tabs;

interface AssetMetaTypes {
  asset: AssetType;
  tab?: string;
  docsProps?: DocumentTableProps;
  eventProps?: AssetEventsPanelProps;
  hidePanels?: assetPanels[];
  onPaneChange?: (key: string) => void;
}

const AssetMeta = (props: AssetMetaTypes) => {
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

  const includesPanel = (pane: assetPanels) =>
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

export default AssetMeta;
