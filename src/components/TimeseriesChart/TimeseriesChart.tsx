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

interface SeriesDictionary {
  [id: number]: DataProviderSeries;
}

// Don't allow updating faster than every 1000ms.
const MINIMUM_UPDATE_FREQUENCY_MILLIS = 1000;
const DEFAULT_END_TIME = Date.now();
const DEFAULT_START_TIME = DEFAULT_END_TIME - 60 * 60 * 24 * 1000;

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

const mergeSeriesDefaults = (
  currentSeries: SeriesDictionary = {},
  series: TimeseriesChartSeries[],
  defaultYAxisDisplayMode: AxisDisplayModeKeys,
  defaultYAxisPlacement: AxisPlacementKeys
): SeriesDictionary => {
  for (const s of series) {
    const current = currentSeries[s.id] || {};
    const { yAxisDisplayMode, yAxisPlacement, ...seriesProps } = s;
    const axisMode = s.yAxisDisplayMode || defaultYAxisDisplayMode;
    const axisPlacement = s.yAxisPlacement || defaultYAxisPlacement;
    const defaultSeries = getDefultSeriesObject(s.id, axisMode, axisPlacement);

    currentSeries[s.id] = { ...defaultSeries, ...current, ...seriesProps };
  }

  return currentSeries;
};

const mergeTimeseriesIdDefaults = (
  currentSeries: SeriesDictionary = {},
  ids: number[],
  yAxisDisplayMode: AxisDisplayModeKeys,
  yAxisPlacement: AxisPlacementKeys
): SeriesDictionary => {
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

const setCollectionsDefaults = (
  collections: TimeseriesChartCollection[],
  yAxisDisplayMode: AxisDisplayModeKeys,
  yAxisPlacement: AxisPlacementKeys
): DataProviderCollection[] =>
  collections.map(c => ({
    ...c,
    yAxisDisplayMode: AxisDisplayMode[c.yAxisDisplayMode || yAxisDisplayMode],
    yAxisPlacement: AxisPlacement[c.yAxisPlacement || yAxisPlacement],
  }));

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
  const [seriesDict, setSeriesDict] = useState<{
    [id: number]: DataProviderSeries;
  }>({});
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
        : mergeSeriesDefaults(
            seriesDict,
            series as TimeseriesChartSeries[],
            yAxisDisplayMode,
            yAxisPlacement
          );

    setSeriesDict({ ...seriesMap });
  }, [series]);
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
        seriesDict[id] = {
          ...seriesDict[id],
          ySubDomain: [min, max],
        };
      }

      // Here we're not assigning new object to avoid unneeded rendering.
      // Basically, `seriesDict` is used to merge internal series state
      // with new series, provided via props
      setSeriesDict(seriesDict);

      if (onDomainsUpdate) {
        onDomainsUpdate(event);
      }
    },
    [onDomainsUpdate, seriesDict]
  );
  const onMouseMove = useCallback(
    (data: { points: TimeseriesChartRulerPoint[] }) => {
      const { onMouseMove: mouseMove } = props;
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
  const seriesToRender =
    typeof series[0] === 'number'
      ? (series as number[]).map(s => seriesDict[s]).filter(Boolean)
      : (series as TimeseriesChartSeries[])
          .map(({ id }) => seriesDict[id])
          .filter(Boolean);
  const collectionToRender = setCollectionsDefaults(
    collections,
    yAxisDisplayMode,
    yAxisPlacement
  );

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
            />
          )}
          <LineChart
            zoomable={zoomable}
            crosshair={showCrosshair}
            annotations={annotations}
            contextChart={{
              visible: contextChart,
              height: 100,
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
