import { FileLink, IdEither } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import { ZoomCenter } from '../../../interfaces';
import { SVG } from '../../../mocks/svg-viewer';

import { MockCogniteClient } from '../../../mocks/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SVGViewer } from '../SVGViewer';
import classesDescription from './classes.md';
import clickDescription from './click.md';
import closableDescription from './closeable.md';
import customDescription from './custom.md';
import fileDescription from './file.md';
import fullDescription from './full.md';
import locateDescription from './locate.md';
import search from './search.md';
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

class CogniteClient extends MockCogniteClient {
  files: any = {
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
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

const getTextFromMetadataNode = (node: Element) =>
  (node.textContent || '').replace(/\s/g, '');

const clientSdkDecorator = (storyFn: any) => (
  <ClientSDKProvider client={sdk}>{storyFn()}</ClientSDKProvider>
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
    'Include close button',
    () => {
      setupMocks();
      return (
        <div style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            handleCancel={action('handleCancel')}
          />
        </div>
      );
    },
    {
      readme: {
        content: closableDescription,
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
  )
  .add(
    'Subscribe to search changes',
    () => {
      setupMocks();
      const handleSearchChange = (value?: string): void => {
        action('handleSearchChange')(value);
      };
      return (
        <div style={{ height: '100vh' }}>
          <SVGViewer
            documentId={5185355395511590}
            handleSearchChange={handleSearchChange}
          />
        </div>
      );
    },
    {
      readme: {
        content: search,
      },
    }
  )
  .add(
    'File',
    () => {
      const file = `<svg width="64" height="38" viewBox="0 0 64 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M50.4542 15.3288V12.1014C50.4542 10.542 49.19 9.27782 47.6306 9.27782C46.0712 9.27782 44.8071 10.542 44.8071 12.1014V16.2143C43.1802 16.5881 41.3005 16.9632 39.4195 17.3383V2.74337C39.3857 1.19796 38.1079 -0.0287567 36.5624 0.000513075H36.549C35.0327 0.00556379 33.8015 1.2272 33.7846 2.74337V18.7098C33.609 18.7038 33.4353 18.7471 33.2831 18.8348C31.5555 19.2042 29.9396 19.5737 28.3237 19.9431L28.2666 19.9561V7.6106C28.2201 6.12184 26.9998 4.93905 25.5103 4.93905C24.0208 4.93905 22.8005 6.12184 22.754 7.6106V21.1972C22.2267 21.2962 21.7164 21.3949 21.2187 21.4912L21.2187 21.4912L21.2187 21.4912L21.2186 21.4912C19.8242 21.761 18.5295 22.0115 17.2414 22.1948V15.8365C17.1762 14.3615 15.9615 13.1993 14.4851 13.1993C13.0087 13.1993 11.794 14.3615 11.7288 15.8365V22.9437C5.46324 23.6926 1.83164 23.4439 1.45248 22.3172C0.679151 20.6624 5.08841 18.423 7.2491 17.3257C7.53399 17.181 7.77978 17.0562 7.96946 16.9551V16.8314H7.84441C6.21618 17.454 -0.802308 20.3272 0.075675 22.8146C0.950969 25.5602 11.7288 26.3104 34.1624 20.8207C52.955 16.2062 61.6017 15.3282 62.4797 17.0761C63.1063 18.5713 58.4676 21.4405 53.958 23.4358C53.8614 23.5342 53.8153 23.6715 53.833 23.8082L53.835 23.8102C53.9593 23.9346 54.0824 24.0577 54.2095 23.9333C55.8363 23.3067 64.3594 19.6953 63.9816 16.701C63.6078 14.7075 59.0974 14.0835 50.4542 15.3288ZM11.7557 30.5551V28.4657C13.5848 28.3609 15.4068 28.1549 17.2132 27.8486V30.5551C17.1802 32.0386 15.9682 33.224 14.4844 33.224C13.0006 33.224 11.7886 32.0386 11.7557 30.5551ZM22.7715 26.9222V34.5242C22.7583 36.0202 23.9519 37.248 25.4477 37.2771C26.9434 37.3062 28.1839 36.1258 28.229 34.6304V25.7995C26.4337 26.2816 24.6113 26.6565 22.7715 26.9222ZM44.5094 22.2346V22.2377L44.504 22.2387L44.5094 22.2346ZM44.5094 22.2377C46.6477 21.8651 48.5336 21.4939 50.1672 21.124V25.4615C50.1423 26.9709 48.9138 28.1827 47.4042 28.1869H47.388C46.6448 28.2075 45.9239 27.9319 45.384 27.4207C44.844 26.9095 44.5294 26.2047 44.5094 25.4615V22.2377ZM33.87 24.7193H33.4936V30.0612C33.5596 31.5763 34.8072 32.7707 36.3238 32.7707C37.8404 32.7707 39.088 31.5763 39.1541 30.0612V23.4729C38.7665 23.5615 38.372 23.65 37.9703 23.74L37.9696 23.7402C36.677 24.0299 35.3111 24.3361 33.87 24.7166V24.7193Z" fill="black"/>
    </svg>
    `;
      return (
        <div style={{ height: '100vh' }}>
          <SVGViewer file={file} />
        </div>
      );
    },
    {
      readme: {
        content: fileDescription,
      },
    }
  );
