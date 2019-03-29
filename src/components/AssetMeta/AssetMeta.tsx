import React from 'react';
import { Tabs } from 'antd';
import AssetDetailsPanel from 'components/AssetDetailsPanel/AssetDetailsPanel';
import AssetEventsPanel from 'components/AssetEventsPanel/AssetEventsPanel';
import DocumentTable from 'components/DocumentTable/DocumentTable';
import {
  AssetEventsPanelProps,
  AssetType,
  assetPanels,
  TableDesignType,
  DocumentTableProps,
} from 'utils/validators';
import { mapAssetMetaData } from 'utils/helpers/assetHelpers';

const { TabPane } = Tabs;

interface AssetMetaTypes {
  asset: AssetType;
  tab?: string;
  detailDesignProps?: TableDesignType;
  docsProps?: DocumentTableProps;
  eventProps?: AssetEventsPanelProps;
  hidePanels?: assetPanels[];
}

const AssetMeta = (props: AssetMetaTypes) => {
  const {
    asset,
    tab: propsTab,
    detailDesignProps,
    docsProps,
    eventProps,
    hidePanels,
  } = props;

  const tab =
    propsTab === 'docs' || propsTab === 'events' ? propsTab : 'details';

  const includesPanel = (pane: assetPanels) =>
    hidePanels ? hidePanels.indexOf(pane) < 0 : true;

  const propsToDetail = asset.metadata
    ? { ...detailDesignProps, dataSource: mapAssetMetaData(asset.metadata) }
    : detailDesignProps;

  return (
    <>
      <h3>{asset.name ? asset.name : asset.id}</h3>
      {asset.description && <p>{asset.description}</p>}

      <Tabs defaultActiveKey={tab}>
        {propsToDetail && includesPanel('details') && (
          <TabPane tab="Details" key="details">
            <AssetDetailsPanel {...propsToDetail} />
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
