import { FileLink, IdEither } from '@cognite/sdk';
import React, { FC } from 'react';
import styled from 'styled-components';
import { sleep } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { SVG } from '../../../mocks/svg-viewer';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import {
  SvgViewerDocumentIdProps,
  SvgViewerFileProps,
  ZoomCenter,
} from '../interfaces';

const API_REQUEST = 'https://example.com';

class CogniteClient extends MockCogniteClient {
  files: any = {
    getDownloadUrls: async (): Promise<(FileLink & IdEither)[]> => {
      await sleep(1000);
      return [
        {
          id: 123,
          downloadUrl: API_REQUEST,
        },
      ];
    },
  };
  get: any = async () => {
    return {
      headers: {},
      status: 200,
      data: SVG,
    };
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const onCancel = () => console.log('handle cancel');

export const handleSearchChange = (value?: string): void => {
  console.log(value);
};

export const zoomCallback = ({
  zoomProgress,
  source,
  zoomCenter,
}: {
  zoomProgress: number;
  source: string;
  zoomCenter?: ZoomCenter;
}) => {
  console.log({ zoomProgress, source, zoomCenter });
};

export const ClassesContainer = styled.div`
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

const getTextFromMetadataNode = (node: Element) =>
  (node.textContent || '').replace(/\s/g, '');

export const metadataClassesConditions = [
  {
    condition: (metadata: Element) =>
      getTextFromMetadataNode(metadata).length % 2 === 0,
    className: 'checklist-asset',
  },
];

export const SearchContainer = styled.div`
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

export const handleClick = (node: HTMLElement): void => {
  const metadataNode = node.querySelector('metadata');
  if (metadataNode) {
    const textContent = getTextFromMetadataNode(metadataNode);
    console.log(textContent);
  }
};

export const isCurrentAsset = (metadata: any) =>
  (metadata.textContent || '').replace(/\s/g, '') === '21PT1019';

export const DocumentIdComponentProps: FC<SvgViewerDocumentIdProps> = () => (
  <></>
);

export const FileComponentProps: FC<SvgViewerFileProps> = () => <></>;
