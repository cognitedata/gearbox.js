import { Asset } from '@cognite/sdk-alpha/dist/src/types/types';
import { Tabs } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKContext } from '../../context/clientSDKContext';
import {
  AssetDocumentsPanelStyles,
  AssetEventsPanelStyles,
  AssetPanelType,
} from '../../interfaces';
import { MetaDocProps } from '../../interfaces/DocumentTypes';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../../utils/promise';
import { AssetDetailsPanel } from '../AssetDetailsPanel';
import { AssetDocumentsPanel } from '../AssetDocumentsPanel';
import { AssetEventsPanel, MetaEventsProps } from '../AssetEventsPanel';
import {
  AssetTimeseriesPanel,
  AssetTimeseriesPanelStyles,
  MetaTimeseriesProps,
} from '../AssetTimeseriesPanel';

const { TabPane } = Tabs;

export interface AssetMetaStyles {
  header?: React.CSSProperties;
  emptyTab?: React.CSSProperties;
  details?: React.CSSProperties;
  timeseries?: AssetTimeseriesPanelStyles;
  documents?: AssetDocumentsPanelStyles;
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
  customSpinner?: React.ReactNode;
}

interface AssetMetaState {
  assetId: number;
  asset: Asset | null;
  isLoading: boolean;
}

export class AssetMeta extends React.Component<AssetMetaProps, AssetMetaState>
  implements ComponentWithUnmountState {
  static contextType = ClientSDKContext;
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
  context!: React.ContextType<typeof ClientSDKContext>;

  isComponentUnmounted = false;

  constructor(props: AssetMetaProps) {
    super(props);
    this.state = {
      assetId: props.assetId,
      asset: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    if (!this.includesPanel('details') && this.props.assetId) {
      if (!this.context) {
        console.error(ERROR_NO_SDK_CLIENT);
        return;
      }
      this.loadAsset(this.props.assetId);
    }
  }

  componentDidUpdate(prevProps: AssetMetaProps) {
    if (
      prevProps.assetId !== this.props.assetId &&
      !this.includesPanel('details')
    ) {
      this.loadAsset(this.props.assetId);
    }
  }

  componentWillUnmount() {
    this.isComponentUnmounted = true;
  }

  async loadAsset(assetId: number) {
    try {
      const assets = await connectPromiseToUnmountState(
        this,
        this.context!.assets.retrieve([{ id: assetId }])
      );
      if (!assets || assets.length !== 1) {
        console.error(ERROR_API_UNEXPECTED_RESULTS);
      }
      this.handleAssetLoaded(assets[0]);
    } catch (error) {
      if (error instanceof CanceledPromiseException !== true) {
        throw error;
      }
    }
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
    const { assetId, styles, customSpinner } = this.props;
    return (
      <TabPane tab="Details" key="details" forceRender={true}>
        <AssetDetailsPanel
          assetId={assetId}
          onAssetLoaded={this.handleAssetLoaded}
          styles={styles && styles.details}
          customSpinner={customSpinner}
        />
      </TabPane>
    );
  }

  renderTimeseries() {
    if (!this.includesPanel('timeseries')) {
      return null;
    }
    const { assetId, timeseriesProps, customSpinner, styles } = this.props;
    return (
      <TabPane tab="Timeseries" key="timeseries">
        <AssetTimeseriesPanel
          assetId={assetId}
          {...timeseriesProps}
          customSpinner={customSpinner}
          styles={styles && styles.timeseries}
        />
      </TabPane>
    );
  }

  renderDocuments() {
    if (!this.includesPanel('documents')) {
      return null;
    }
    const { assetId, styles, docsProps, customSpinner } = this.props;
    return (
      <TabPane tab="Documents" key="documents">
        <AssetDocumentsPanel
          {...docsProps}
          assetId={assetId}
          styles={styles && styles.documents}
          customSpinner={customSpinner}
        />
      </TabPane>
    );
  }

  renderEvents() {
    if (!this.includesPanel('events')) {
      return null;
    }
    const { assetId, styles, eventProps, customSpinner } = this.props;
    return (
      <TabPane tab="Events" key="events">
        <AssetEventsPanel
          {...eventProps}
          assetId={assetId}
          styles={styles && styles.events}
          customSpinner={customSpinner}
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
