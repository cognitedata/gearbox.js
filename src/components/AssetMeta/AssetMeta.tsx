import { Asset /*Event, File, Timeseries*/ } from '@cognite/sdk';
import { Tabs } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  AssetEventsPanelStyles,
  AssetPanelType,
  DocumentTableProps,
  DocumentTableStyles,
} from '../../interfaces';
import { MetaDocProps } from '../../interfaces/DocumentTypes';
import { AssetDetailsPanel } from '../AssetDetailsPanel';
import { AssetEventsPanel, MetaEventsProps } from '../AssetEventsPanel';
import {
  AssetTimeseriesPanel,
  MetaTimeseriesProps,
} from '../AssetTimeseriesPanel';
import { DocumentTable } from './components/DocumentTable';

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
  docs: DocumentTableProps | null;
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
      docs: null,
      isLoading: true,
    };
  }

  // componentDidUpdate(prevProps: AssetMetaProps) {
  //   if (prevProps.assetId !== this.props.assetId) {
  //     this.setState({
  //       isLoading: true,
  //     });
  //   }
  // }

  /*loadAll = async (assetId: number) => {
    const { eventProps, docsProps, timeseriesProps } = this.props;
    const query = { assetId, limit: 1000 };

    const promises: [
      Promise<Event[]> | Promise<null>,
      Promise<File[]> | Promise<null>,
      Promise<Timeseries[]> | Promise<null>
    ] = [
      this.includesPanel('events')
        ? getAssetEvent(query)
        : Promise.resolve(null),
      this.includesPanel('documents')
        ? getAssetFiles(query)
        : Promise.resolve(null),
      this.includesPanel('timeseries')
        ? getAssetTimeseries(query)
        : Promise.resolve(null),
    ];

    try {
      const [events, docs, timeseries] = await connectPromiseToUnmountState(
        this,
        Promise.all(promises)
      );

      this.setState({
        isLoading: false,
        assetEvents: events ? { ...eventProps, events } : null,
        docs: docs ? { ...docsProps, docs } : null,
        timeseries: timeseries ? { ...timeseriesProps, timeseries } : null,
      });
    } catch (error) {
      if (error instanceof CanceledPromiseException !== true) {
        throw error;
      }
    }
  };*/

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
    const { styles } = this.props;
    const { docs } = this.state;
    if (!this.includesPanel('documents')) {
      return null;
    }
    return (
      <TabPane tab="Documents" key="documents">
        <DocumentTable
          {...docs || { docs: [] }}
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
          assetId={assetId}
          {...eventProps}
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
