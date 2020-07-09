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
  TimeseriesChartProps,
  TimeseriesChartRulerPoint,
  TimeseriesChartRulerPointsMap,
  TimeseriesChartSeries,
} from './interfaces';

interface HiddenSeriesMap {
  [id: number]: boolean;
}

// Don't allow updating faster than every 1000ms.
const MINIMUM_UPDATE_FREQUENCY_MILLIS = 1000;
const DEFAULT_END_TIME = Date.now();
const DEFAULT_START_TIME = DEFAULT_END_TIME - 60 * 60 * 24 * 1000;

const setSeriesDefaults = (
  series: TimeseriesChartSeries[],
  yAxisDisplayMode: AxisDisplayModeKeys,
  yAxisPlacement: AxisPlacementKeys
): DataProviderSeries[] =>
  series.map(s => ({
    ...s,
    color: s.color || getColorByString(s.id.toString()),
    yAxisDisplayMode: AxisDisplayMode[s.yAxisDisplayMode || yAxisDisplayMode],
    yAxisPlacement: AxisPlacement[s.yAxisPlacement || yAxisPlacement],
    yAccessor: s.yAccessor || DataLoader.yAccessor,
    y0Accessor: s.y0Accessor || DataLoader.y0Accessor,
    y1Accessor: s.y1Accessor || DataLoader.y1Accessor,
    xAccessor: s.xAccessor || DataLoader.xAccessor,
  }));

const setTimeseriesIdDefaults = (
  ids: number[],
  yAxisDisplayMode: AxisDisplayModeKeys,
  yAxisPlacement: AxisPlacementKeys
): DataProviderSeries[] =>
  ids.map(id => ({
    id,
    color: getColorByString(id.toString()),
    yAxisDisplayMode: AxisDisplayMode[yAxisDisplayMode],
    yAxisPlacement: AxisPlacement[yAxisPlacement],
    yAccessor: DataLoader.yAccessor,
    y0Accessor: DataLoader.y0Accessor,
    y1Accessor: DataLoader.y1Accessor,
    xAccessor: DataLoader.xAccessor,
  }));

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
  const [rulerPoints, setRulerPoints] = useState<TimeseriesChartRulerPointsMap>(
    {}
  );
  const [hiddenSeries, setHiddenSeries] = useState<HiddenSeriesMap>({});
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
    const hiddenSeriesMap: HiddenSeriesMap = {};
    (series as TimeseriesChartSeries[]).forEach(
      (s: TimeseriesChartSeries) => (hiddenSeriesMap[s.id] = !!s.hidden)
    );

    //todo: add collections support

    setHiddenSeries(hiddenSeriesMap);
  }, [series]);
  const onFetchData = () => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  };
  const onMouseMove = useCallback(
    (data: { points: TimeseriesChartRulerPoint[] }) => {
      const { onMouseMove: mouseMove } = props;
      const { points = [] } = data;
      const rulerPoints: TimeseriesChartRulerPointsMap = {};

      points
        .filter(point => !hiddenSeries[point.id])
        .forEach(point => (rulerPoints[point.id] = point));

      setRulerPoints(rulerPoints);

      if (mouseMove) {
        mouseMove(data);
      }
    },
    [props.onMouseMove, hiddenSeries]
  );

  const showCrosshair: boolean = !!ruler && ruler.visible;
  const seriesToRender =
    typeof series[0] === 'number'
      ? setTimeseriesIdDefaults(
          series as number[],
          yAxisDisplayMode,
          yAxisPlacement
        )
      : setSeriesDefaults(
          series as TimeseriesChartSeries[],
          yAxisDisplayMode,
          yAxisPlacement
        );
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
          onDomainsUpdate={onDomainsUpdate}
        >
          {ruler && ruler.visible && (
            <CursorOverview
              wrapperRef={chartWrapper.current}
              series={seriesToRender}
              rulerPoints={rulerPoints}
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
