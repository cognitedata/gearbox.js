import { API } from '@cognite/sdk/dist/src/resources/api';
import { FileLink, IdEither } from '@cognite/sdk/dist/src/types/types';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import { ZoomCenter } from '../../../interfaces';
import { SVG } from '../../../mocks/svg-viewer';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SVGViewer } from '../SVGViewer';

import classesDescription from './classes.md';
import clickDescription from './click.md';
import customDescription from './custom.md';
import fullDescription from './full.md';
import locateDescription from './locate.md';
import zoomDescription from './zoom.md';

const API_REQUEST = 'https://example.com';

const setupMocks = () => {
  const nativeFetch = fetch;
  // @ts-ignore
  fetch = () => {
    // @ts-ignore
    fetch = nativeFetch;

    return Promise.resolve({
      status: 200,
      text: () => SVG,
    });
  };
};

const fakeClient: API = {
  // @ts-ignore
  files: {
    getDownloadUrls: (): Promise<(FileLink & IdEither)[]> => {
      return new Promise(resolve => {
        setTimeout(() => {
          const response: FileLink & IdEither = {
            id: 123,
            downloadUrl: API_REQUEST,
          };
          resolve([response]);
        }, 1000);
      });
    },
  },
};

const getTextFromMetadataNode = (node: Element) =>
  (node.textContent || '').replace(/\s/g, '');

const clientSdkDecorator = (storyFn: any) => (
  <ClientSDKProvider client={fakeClient}>{storyFn()}</ClientSDKProvider>
);

storiesOf('SVGViewer', module)
  .addDecorator(clientSdkDecorator)
  .add(
    'Full description',
    () => {
      setupMocks();
      return (
        <div style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            title="Title"
            description="Description"
          />
        </div>
      );
    },
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('SVGViewer/Examples', module)
  .addDecorator(clientSdkDecorator)
  .add(
    'Locate asset',
    () => {
      setupMocks();
      return (
        <div style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            isCurrentAsset={(metadata: Element) =>
              getTextFromMetadataNode(metadata) === '21PT1019'
            }
          />
        </div>
      );
    },
    {
      readme: {
        content: locateDescription,
      },
    }
  )
  .add(
    'Handle item click',
    () => {
      setupMocks();
      const handleItemClick = (node: HTMLElement): void => {
        const metadataNode = node.querySelector('metadata');
        if (metadataNode) {
          const textContent = getTextFromMetadataNode(metadataNode);
          action('handleItemClick')(textContent);
        }
      };
      return (
        <div style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            handleItemClick={handleItemClick}
          />
        </div>
      );
    },
    {
      readme: {
        content: clickDescription,
      },
    }
  )
  .add(
    'Custom classes',
    () => {
      setupMocks();
      const Container = styled.div`
        .checklist-asset {
          outline: auto 2px #3838ff;
          transition: all 0.2s ease;
          > {
            text {
              stroke: #3838ff;
              fill: #3838ff;
              transition: all 0.2s ease;
              text-decoration: none;
            }
            path {
              stroke: #3838ff;
              transition: all 0.2s ease;
            }
          }
          &:hover,
          &:focus {
            outline: auto 2px #36a2c2;
          }
        }
      `;
      const metadataClassesConditions = [
        {
          condition: (metadata: Element) =>
            getTextFromMetadataNode(metadata).length % 2 === 0,
          className: 'checklist-asset',
        },
      ];
      return (
        <Container style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            metadataClassesConditions={metadataClassesConditions}
          />
        </Container>
      );
    },
    {
      readme: {
        content: classesDescription,
      },
    }
  )
  .add(
    'Custom search result color',
    () => {
      setupMocks();
      const Container = styled.div`
        .search-result {
          &.metadata-container {
            text {
              stroke: red !important;
              fill: red !important;
              font-weight: bold;
            }
          }
          &:not(.metadata-container) {
            stroke: red !important;
            fill: red !important;
            font-weight: bold;
          }
        }
      `;
      return (
        <Container style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            customClassNames={{
              searchResults: 'search-result',
            }}
          />
        </Container>
      );
    },
    {
      readme: {
        content: customDescription,
      },
    }
  )
  .add(
    'On zoom change callback',
    () => {
      setupMocks();
      const zoomCallback = ({
        zoomProgress,
        source,
        zoomCenter,
      }: {
        zoomProgress: number;
        source: string;
        zoomCenter?: ZoomCenter;
      }) => {
        const params = [];
        params.push(`zoomProgress: ${zoomProgress}`);
        params.push(`source: ${source}`);
        if (zoomCenter) {
          params.push(`zoomCenter: (${zoomCenter.x} ${zoomCenter.y})`);
        }
        action('handleAnimateZoom')(params);
      };
      return (
        <div style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            handleAnimateZoom={zoomCallback}
          />
        </div>
      );
    },
    {
      readme: {
        content: zoomDescription,
      },
    }
  );
