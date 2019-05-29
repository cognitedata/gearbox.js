import { Asset, Event, File, Timeseries } from '@cognite/sdk';
import { Spin, Tabs } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  getAssetEvent,
  getAssetFiles,
  getAssetTimeseries,
  retrieveAsset,
} from '../../api';
import {
  AssetEventsPanelProps,
  AssetPanelType,
  DocumentTableProps,
} from '../../interfaces';
import { MetaEventsProps } from '../../interfaces/AssetTypes';
import { MetaDocProps } from '../../interfaces/DocumentTypes';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../../utils/promise';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { AssetEventsPanel } from './components/AssetEventsPanel';
import { DocumentTable } from './components/DocumentTable';
import {
  MetaTimeseriesProps,
  TimeseriesPanel,
  TimeseriesPanelProps,
} from './components/TimeseriesPanel';

const SpinContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const { TabPane } = Tabs;

interface AssetMetaProps {
  assetId: number;
  tab?: string;
  docsProps?: MetaDocProps;
  eventProps?: MetaEventsProps;
  timeseriesProps?: MetaTimeseriesProps;
  hidePanels?: AssetPanelType[];
  onPaneChange?: (key: string) => void;
}

interface AssetMetaState {
  asset: Asset | null;
  assetEvents: AssetEventsPanelProps | null;
  docs: DocumentTableProps | null;
  timeseries: TimeseriesPanelProps | null;
  isLoading: boolean;
}

export class AssetMeta extends React.Component<AssetMetaProps, AssetMetaState>
  implements ComponentWithUnmountState {
  isComponentUnmounted: boolean;

  constructor(props: AssetMetaProps) {
    super(props);
    this.isComponentUnmounted = false;
    this.state = {
      asset: null,
      assetEvents: null,
      docs: null,
      timeseries: null,
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

  componentWillUnmount() {
    this.isComponentUnmounted = true;
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
    const { eventProps, docsProps, timeseriesProps } = this.props;
    const query = { assetId, limit: 1000 };

    const promises: [
      Promise<Asset>,
      Promise<Event[]> | Promise<null>,
      Promise<File[]> | Promise<null>,
      Promise<Timeseries[]> | Promise<null>
    ] = [
      retrieveAsset(assetId),
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
      const [
        asset,
        events,
        docs,
        timeseries,
      ] = await connectPromiseToUnmountState(this, Promise.all(promises));

      this.setState({
        isLoading: false,
        asset: asset || null,
        assetEvents: events ? { ...eventProps, events } : null,
        docs: docs ? { ...docsProps, docs } : null,
        timeseries: timeseries ? { ...timeseriesProps, timeseries } : null,
      });
    } catch (error) {
      if (error instanceof CanceledPromiseException !== true) {
        throw error;
      }
    }
  };

  tabStyle = (tab: string, contentLen: number) =>
    contentLen > 0 ? (
      <span>{tab}</span>
    ) : (
      <span style={{ color: '#9b9b9b' }}>({tab})</span>
    );

  includesPanel = (pane: AssetPanelType): boolean =>
    this.props.hidePanels ? this.props.hidePanels.indexOf(pane) < 0 : true;

  render() {
    const { tab: propsTab, onPaneChange } = this.props;
    const { asset, assetEvents, docs, timeseries, isLoading } = this.state;

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
          {assetEvents && this.includesPanel('timeseries') && (
            <TabPane
              tab={this.tabStyle(
                'Timeseries',
                timeseries && timeseries.timeseries
                  ? timeseries.timeseries.length
                  : 0
              )}
              key="timeseries"
            >
              <TimeseriesPanel {...timeseries} />
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
