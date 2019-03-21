import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import * as Components from '../src/components';

import { withInfo } from '@storybook/addon-info';
import 'antd/dist/antd.css';

addDecorator(withInfo);

const styles = {
  margin: '1em',
};

const CenterDecorator = storyFn => <div style={styles}>{storyFn()}</div>;

addDecorator(CenterDecorator);

const infoDecorator = (storyFn, options) => {
  if (!options.parameters.info) return storyFn();

  const component = Components[options.kind];

  options.parameters.info.propTablesExclude = component ? [component] : [];
  options.parameters.info.inline = true;

  return storyFn();
};

addDecorator(infoDecorator);
// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
