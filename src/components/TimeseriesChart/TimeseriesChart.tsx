import {
  AxisDisplayMode,
  AxisDisplayModeKeys,
  AxisPlacement,
  AxisPlacementKeys,
  DataProvider,
  DataProviderCollection,
  DataProviderSeries,
  LineChart,
} from '@cognite/griff-react';
import { Spin } from 'antd';
import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { decimalTickFormatter } from '../../utils/axisSigFix';
import { getColorByString } from '../../utils/colors';
import { CursorOverview } from './components/CursorOverview';
import {
  SizeContext,
  SizeContextType,
} from './components/TimeseriesChartSizeProvider';
import { DataLoader } from './dataLoader';
import {
  TimeseriesChartCollection,
  TimeseriesChartDomainUpdate,
  TimeseriesChartProps,
  TimeseriesChartRulerPoint,
  TimeseriesChartSeries,
} from './interfaces';

interface IdKeyDictionary<T> {
  [id: number]: T;
}

// Don't allow updating faster than every 1000ms.
const MINIMUM_UPDATE_FREQUENCY_MILLIS = 1000;
const DEFAULT_END_TIME = Date.now();
const DEFAULT_START_TIME = DEFAULT_END_TIME - 60 * 60 * 24 * 1000;
const CONTEXT_CHART_DEFAULT_HEIGHT = 100;

const getDefultSeriesObject = (
  id: number,
  yAxisDisplayMode: AxisDisplayModeKeys,
  yAxisPlacement: AxisPlacementKeys
): DataProviderSeries => ({
  id,
  color: getColorByString(id.toString()),
  yAxisDisplayMode: AxisDisplayMode[yAxisDisplayMode],
  yAxisPlacement: AxisPlacement[yAxisPlacement],
  yAccessor: DataLoader.yAccessor,
  y0Accessor: DataLoader.y0Accessor,
  y1Accessor: DataLoader.y1Accessor,
  xAccessor: DataLoader.xAccessor,
});

const mergeTimeseriesIdDefaults = (
  currentSeries: IdKeyDictionary<DataProviderSeries> = {},
  ids: number[],
  yAxisDisplayMode: AxisDisplayModeKeys,
  yAxisPlacement: AxisPlacementKeys
): IdKeyDictionary<DataProviderSeries> => {
  for (const id of ids) {
    const series = currentSeries[id] || {};
    const defaultSeries = getDefultSeriesObject(
      id,
      yAxisDisplayMode,
      yAxisPlacement
    );

    currentSeries[id] = { ...defaultSeries, ...series };
  }

  return currentSeries;
};

const mergeCollections = <
  T extends { [id: number]: any },
  R extends {
    id: number;
    yAxisDisplayMode?: AxisDisplayModeKeys;
    yAxisPlacement?: AxisPlacementKeys;
  }[]
>(
  currentDict: T,
  collections: R,
  defaultYAxisDisplayMode: AxisDisplayModeKeys,
  defaultYAxisPlacement: AxisPlacementKeys
): T => {
  for (const c of collections) {
    const current = currentDict[c.id] || {};
    const { yAxisDisplayMode, yAxisPlacement, ...rest } = c;
    const axisMode = yAxisDisplayMode || defaultYAxisDisplayMode;
    const axisPlacement = yAxisPlacement || defaultYAxisPlacement;
    const defaultSeries = getDefultSeriesObject(c.id, axisMode, axisPlacement);

    currentDict[c.id] = { ...defaultSeries, ...current, ...rest };
  }

  return currentDict;
};

export const TimeseriesChart: React.FC<TimeseriesChartProps> = ({
  series,
  ruler,
  start = DEFAULT_START_TIME,
  end = DEFAULT_END_TIME,
  pointsPerSeries = 600,
  xAxisHeight = 50,
  updateInterval = 5000,
  zoomable = false,
  contextChart = false,
  yAxisDisplayMode = 'ALL',
  yAxisPlacement = 'RIGHT',
  liveUpdate = false,
  annotations = [],
  collections = [],
  onFetchDataError = (e: Error) => {
    throw e;
  },
  onDomainsUpdate,
  onMouseOut,
  onBlur,
  ...props
}) => {
  const chartWrapper = useRef(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [rulerPoints, setRulerPoints] = useState<TimeseriesChartRulerPoint[]>(
    []
  );
  const [seriesDict, setSeriesDict] = useState<
    IdKeyDictionary<DataProviderSeries>
  >({});
  const [collectionsDict, setCollectionsDict] = useState<
    IdKeyDictionary<DataProviderCollection>
  >({});

  const client = useCogniteContext(TimeseriesChart);

  // this one is needed only in test purposes,
  // to disable placeholder of react-sizeme
  const { width: sw, height: sh } = useContext<SizeContextType>(SizeContext);
  const size = sw && sh ? { width: sw, height: sh } : undefined;

  if (!client) {
    console.error(ERROR_NO_SDK_CLIENT);
    return null;
  }

  const dataLoader = useMemo(() => {
    return new DataLoader(client!);
  }, []);

  useEffect(() => {
    const seriesMap =
      typeof series[0] === 'number'
        ? mergeTimeseriesIdDefaults(
            seriesDict,
            series as number[],
            yAxisDisplayMode,
            yAxisPlacement
          )
        : mergeCollections<
            IdKeyDictionary<DataProviderSeries>,
            TimeseriesChartSeries[]
          >(
            seriesDict,
            series as TimeseriesChartSeries[],
            yAxisDisplayMode,
            yAxisPlacement
          );

    setSeriesDict({ ...seriesMap });
  }, [series]);

  useEffect(() => {
    const collectionsMap = mergeCollections<
      IdKeyDictionary<DataProviderCollection>,
      TimeseriesChartCollection[]
    >(collectionsDict, collections, yAxisDisplayMode, yAxisPlacement);

    setCollectionsDict(collectionsMap);
  }, [collections]);

  const onFetchData = () => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  };
  const handleDomainsUpdate = useCallback(
    (event: { [id: number]: TimeseriesChartDomainUpdate }) => {
      for (const id in event) {
        const {
          y: [min, max],
        } = event[id];

        if (collectionsDict[id]) {
          collectionsDict[id] = {
            ...collectionsDict[id],
            ySubDomain: [min, max],
          };
        } else if (
          seriesDict[id] &&
          seriesDict[id].collectionId === undefined
        ) {
          seriesDict[id] = {
            ...seriesDict[id],
            ySubDomain: [min, max],
          };
        }
      }

      // Here we're not assigning new object to avoid unneeded rendering.
      // Basically, `seriesDict` is used to merge internal series state
      // with new series, provided via props
      setSeriesDict(seriesDict);
      setCollectionsDict(collectionsDict);

      if (onDomainsUpdate) {
        onDomainsUpdate(event);
      }
    },
    [onDomainsUpdate, seriesDict, collectionsDict]
  );
  const onMouseMove = useCallback(
    (data: { points: TimeseriesChartRulerPoint[] }) => {
      const { onMouseMove: mouseMove } = props;

      if (!ruler && !mouseMove) {
        return;
      }

      const { points = [] } = data;
      const rulerPoints: TimeseriesChartRulerPoint[] = points.filter(
        point => !seriesDict[point.id].hidden
      );

      setRulerPoints(rulerPoints);

      if (mouseMove) {
        mouseMove(points);
      }
    },
    [props.onMouseMove, seriesDict]
  );

  const showCrosshair: boolean = !!ruler && ruler.visible;
  const cursorOverviewOffset = contextChart
    ? CONTEXT_CHART_DEFAULT_HEIGHT + xAxisHeight * 2
    : xAxisHeight;
  const seriesToRender =
    typeof series[0] === 'number'
      ? (series as number[]).map(s => seriesDict[s]).filter(Boolean)
      : (series as TimeseriesChartSeries[])
          .map(({ id }) => seriesDict[id])
          .filter(Boolean);
  const collectionToRender = collections
    .map(c => collectionsDict[c.id])
    .filter(Boolean);

  return seriesToRender.length ? (
    <Spin spinning={!isLoaded}>
      <Wrapper
        style={props.styles && props.styles.container}
        ref={chartWrapper}
      >
        <DataProvider
          defaultLoader={dataLoader.cogniteloader}
          series={seriesToRender}
          onFetchData={onFetchData}
          pointsPerSeries={pointsPerSeries}
          collections={collectionToRender}
          timeDomain={[+start, +end]}
          onFetchDataError={onFetchDataError}
          updateInterval={
            liveUpdate
              ? Math.max(updateInterval, MINIMUM_UPDATE_FREQUENCY_MILLIS)
              : 0
          }
          onUpdateDomains={handleDomainsUpdate}
        >
          {ruler && (
            <CursorOverview
              wrapperEl={chartWrapper.current}
              points={rulerPoints}
              ruler={ruler}
              bottomDateLabelOffset={cursorOverviewOffset}
            />
          )}
          <LineChart
            zoomable={zoomable}
            crosshair={showCrosshair}
            annotations={annotations}
            contextChart={{
              visible: contextChart,
              height: CONTEXT_CHART_DEFAULT_HEIGHT,
              isDefault: true,
            }}
            height={props.height}
            width={props.width}
            yAxisFormatter={decimalTickFormatter}
            xAxisHeight={xAxisHeight}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
            onBlur={onBlur}
            size={size}
          />
        </DataProvider>
      </Wrapper>
    </Spin>
  ) : null;
};

const Wrapper = styled.div`
  height: 500px;
  width: 100%;
`;
