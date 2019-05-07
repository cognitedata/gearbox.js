import { OnProgressData } from '@cognite/3d-viewer';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import { createFakeViewer, generateNumber } from '../../../mocks';
import { mockCreateViewer, Model3DViewer } from '../Model3DViewer';

import * as full from './full.md';

const modelID = 0;
const revisionID = 0;

const Wrapper = styled.div`
  padding: 20px;
`;

const onClick = (modelId: number) =>
  action('onClick')(modelId || generateNumber());
const onProgress = (progress: OnProgressData) => action('onProgress')(progress);
const onComplete = () => action('onComplete')();
const onReady = () =>
  action('onReady')(
    { name: 'viewer' },
    { name: 'model' },
    { name: 'revision' }
  );

storiesOf('Model3DViewer', module).add(
  'Full description',
  () => {
    mockCreateViewer(createFakeViewer);

    return (
      <Wrapper>
        <Model3DViewer
          modelId={modelID}
          revisionId={revisionID}
          onClick={onClick}
          onProgress={onProgress}
          onComplete={onComplete}
          onReady={onReady}
        />
      </Wrapper>
    );
  },
  {
    readme: {
      content: full,
    },
  }
);
