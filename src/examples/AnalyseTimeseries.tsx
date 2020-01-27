import { CogniteClient } from '@cognite/sdk';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ClientSDKProvider } from '../components/ClientSDKProvider';
import {
  ChartRulerConfig,
  TimeseriesChart,
} from '../components/TimeseriesChart';
import { AppContext } from './app/App';

const NobsPanel = styled.div`
  border: 1px solid #002c3e;
  color: #002c3e;
  background-color: #f7f8f3;
  padding: 4px;
  margin-bottom: 4px;
`;

const ContentPanel = styled.div`
  border: 1px dotted #002c3e;
  padding: 4px;
`;

const AnalyseTimeseries = () => {
  const ctx = useContext(AppContext);

  const [timeseriesIds, setTimeseriesIds] = useState([0]);
  const [zoomable, setZoomable] = useState(true);
  const [contextChart, setContextChart] = useState(false);
  const [crosshair, setCrosshair] = useState(false);

  const rulerConfig: ChartRulerConfig | undefined = { visible: true };
  const [ruler, setRuler] = useState<ChartRulerConfig | undefined>({
    visible: true,
  });

  useEffect(() => {
    async function loadData() {
      const client: CogniteClient | null = ctx!.client;
      if (!client) {
        return;
      }

      const firstFive = await client.timeseries.list({ limit: 3 });

      setTimeseriesIds([firstFive.items[1].id, firstFive.items[2].id]);
    }

    loadData();
  }, []);

  return (
    <ClientSDKProvider client={ctx!.client!}>
      <NobsPanel>
        <label>
          <input
            type="checkbox"
            checked={zoomable}
            onChange={() => {
              setZoomable(!zoomable);
            }}
          />
          &nbsp;&nbsp;Zoomable
        </label>
        <span>&nbsp;&nbsp;</span>

        <label>
          <input
            type="checkbox"
            checked={contextChart}
            onChange={() => {
              setContextChart(!contextChart);
            }}
          />
          &nbsp;&nbsp;Context Chart
        </label>
        <span>&nbsp;&nbsp;</span>

        <label>
          <input
            type="checkbox"
            checked={crosshair}
            onChange={() => {
              setCrosshair(!crosshair);
            }}
          />
          &nbsp;&nbsp;Crosshair
        </label>
        <span>&nbsp;&nbsp;</span>

        <label>
          <input
            type="checkbox"
            checked={!!ruler}
            onChange={() => {
              if (ruler === undefined) {
                setRuler(rulerConfig);
              } else {
                setRuler(undefined);
              }
            }}
          />
          &nbsp;&nbsp;Ruler
        </label>
      </NobsPanel>

      <ContentPanel>
        {timeseriesIds[0] !== 0 && (
          <TimeseriesChart
            timeseriesIds={timeseriesIds}
            zoomable={zoomable}
            contextChart={contextChart}
            crosshair={crosshair}
            ruler={ruler}
            startTime={new Date(2019, 11, 1)}
            endTime={new Date(2019, 11, 30)}
          />
        )}
      </ContentPanel>
    </ClientSDKProvider>
  );
};

export { AnalyseTimeseries };
