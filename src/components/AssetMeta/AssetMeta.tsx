import { Asset, CogniteClient } from '@cognite/sdk';
import { Tabs } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import {
  AnyIfEmpty,
  AssetDocumentsPanelStyles,
  AssetEventsPanelStyles,
  AssetPanelType,
} from '../../interfaces';
import { MetaDocProps } from '../../interfaces/DocumentTypes';
import { defaultTheme } from '../../theme/defaultTheme';
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
import { MetaDescriptionListProps } from '../DescriptionList';

const { TabPane } = Tabs;

export interface AssetMetaStyles {
  header?: React.CSSProperties;
  emptyTab?: React.CSSProperties;
  details?: React.CSSProperties;
  timeseries?: AssetTimeseriesPanelStyles;
  documents?: AssetDocumentsPanelStyles;
  events?: AssetEventsPanelStyles;
}

export interface AssetMetaProps {
  /**
   * Asset Id
   */
  assetId: number;
  /**
   * List of panes to be hidden
   */
  hidePanels?: AssetPanelType[];
  /**
   * Defines pane that will be activated once the data has been loaded
   */
  tab?: string;
  /**
   * Function triggered when a user changes panes
   */
  onPaneChange?: (key: string) => void;
  /**
   * Object passed as props to inner component that presents details pane
   */
  detailsProps?: MetaDescriptionListProps;
  /**
   * Object passed as props to inner component that presents timeseries pane
   */
  timeseriesProps?: MetaTimeseriesProps;
  /**
   * Object passed as props to inner component that presents documents pane
   */
  docsProps?: MetaDocProps;
  /**
   * Object passed as props to inner component that presents events pane
   */
  eventProps?: MetaEventsProps;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: React.ReactNode;
  /**
   * Object that defines inline CSS styles for inner elements of the component.
   */
  styles?: AssetMetaStyles;
  theme?: AnyIfEmpty<{}>;
}

interface AssetMetaState {
  assetId: number;
  asset: Asset | null;
  isLoading: boolean;
}

class AssetMeta extends Component<AssetMetaProps, AssetMetaState>
  implements ComponentWithUnmountState {
  static contextType = ClientSDKProxyContext;
  static defaultProps = {
    theme: { ...defaultTheme },
  };
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
  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;

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
    // @ts-ignore
    if (!this.includesPanel('details') && this.props.assetId) {
      this.client = this.context(Component.displayName || '')!;
      if (!this.client) {
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
        this.client.assets.retrieve([{ id: assetId }])
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
    const { assetId, styles, customSpinner, detailsProps } = this.props;
    return (
      <TabPane tab="Details" key="details" forceRender={true}>
        <AssetDetailsPanel
          assetId={assetId}
          onAssetLoaded={this.handleAssetLoaded}
          styles={styles && styles.details}
          customSpinner={customSpinner}
          {...detailsProps}
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

const ComponentWithTheme = withDefaultTheme(AssetMeta);
ComponentWithTheme.displayName = 'AssetMeta';

export { AssetMeta as AssetMetaWithoutTheme };
export { ComponentWithTheme as AssetMeta };
