import React from 'react';
import { addParameters } from '@storybook/react';
import { DocsContainer, Preview, SourceState } from '@storybook/addon-docs/dist/blocks';

addParameters({
  options: {
    showRoots: true
  },
  docs: {
    container: DocsContainer,
    preview: Preview.defaultProps = { withSource: SourceState.OPEN }
  },
});
