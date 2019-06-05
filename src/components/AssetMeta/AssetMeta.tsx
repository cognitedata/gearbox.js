import { Asset } from '@cognite/sdk';
import { Tabs } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  AssetEventsPanelStyles,
  AssetPanelType,
  DocumentTableStyles,
} from '../../interfaces';
import { MetaDocProps } from '../../interfaces/DocumentTypes';
import { AssetDetailsPanel } from '../AssetDetailsPanel';
import { AssetDocumentsPanel } from '../AssetDocumentsPanel';
import { AssetEventsPanel, MetaEventsProps } from '../AssetEventsPanel';
import {
  AssetTimeseriesPanel,
  MetaTimeseriesProps,
} from '../AssetTimeseriesPanel';

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
  timeseriesProps?: MetaTimeseriesProps;
  hidePanels?: AssetPanelType[];
  onPaneChange?: (key: string) => void;
  styles?: AssetMetaStyles;
}

interface AssetMetaState {
  assetId: number;
  asset: Asset | null;
  isLoading: boolean;
}

export class AssetMeta extends React.Component<AssetMetaProps, AssetMetaState> {
  static getDerivedStateFromProps(
    props: AssetMetaProps,
    state: AssetMetaState
  ) {
    if (props.assetId !== state.assetId) {
      return {
        isLoading: true,
        asset: null,
        assetId: props.assetId,
      };
    } else {
      return null;
    }
  }

  constructor(props: AssetMetaProps) {
    super(props);
    this.state = {
      assetId: props.assetId,
      asset: null,
      isLoading: true,
    };
  }

  includesPanel = (pane: AssetPanelType): boolean =>
    this.props.hidePanels ? this.props.hidePanels.indexOf(pane) < 0 : true;

  handleAssetLoaded = (asset: Asset) => {
    this.setState({
      asset,
      isLoading: false,
    });
  };

  renderDetails() {
    if (!this.includesPanel('details')) {
      return null;
    }
    const { styles } = this.props;
    return (
      <TabPane tab="Details" key="details">
        <AssetDetailsPanel
          assetId={this.props.assetId}
          onAssetLoaded={this.handleAssetLoaded}
          styles={styles && styles.details}
        />
      </TabPane>
    );
  }

  renderTimeseries() {
    if (!this.includesPanel('timeseries')) {
      return null;
    }
    const { assetId, timeseriesProps } = this.props;
    return (
      <TabPane tab="Timeseries" key="timeseries">
        <AssetTimeseriesPanel assetId={assetId} {...timeseriesProps} />
      </TabPane>
    );
  }

  renderDocuments() {
    const { assetId, styles, docsProps } = this.props;
    if (!this.includesPanel('documents')) {
      return null;
    }
    return (
      <TabPane tab="Documents" key="documents">
        <AssetDocumentsPanel
          {...docsProps}
          assetId={assetId}
          styles={styles && styles.documents}
        />
      </TabPane>
    );
  }

  renderEvents() {
    const { assetId, styles, eventProps } = this.props;
    if (!this.includesPanel('events')) {
      return null;
    }
    return (
      <TabPane tab="Events" key="events">
        <AssetEventsPanel
          {...eventProps}
          assetId={assetId}
          styles={styles && styles.events}
        />
      </TabPane>
    );
  }

  render() {
    const { assetId, styles, tab: propsTab, onPaneChange } = this.props;
    const { asset, isLoading } = this.state;

    const tab =
      propsTab === 'documents' || propsTab === 'events' ? propsTab : 'details';

    if (!assetId) {
      return <p>no Asset</p>;
    }

    return (
      <>
        <AssetMetaHeader isLoading={isLoading} style={styles && styles.header}>
          <h3>{asset ? (asset.name ? asset.name : asset.id) : '...'}</h3>
          <p>{(asset && asset.description) || '...'}</p>
        </AssetMetaHeader>
        <Tabs defaultActiveKey={tab} onChange={onPaneChange}>
          {this.renderDetails()}
          {this.renderTimeseries()}
          {this.renderDocuments()}
          {this.renderEvents()}
        </Tabs>
      </>
    );
  }
}

const AssetMetaHeader = styled.div<{ isLoading: boolean }>`
  visibility: ${({ isLoading }) => (isLoading ? 'hidden' : 'visible')};
`;
