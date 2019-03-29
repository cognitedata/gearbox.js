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
  if (!options.parameters.info) { options.parameters.info = {}; }

  const component = Components[options.kind];
  const {parameters: {info: {propTablesExclude}}} = options;

  if (!propTablesExclude) { options.parameters.info.propTablesExclude = [] }
  if (component) { options.parameters.info.propTablesExclude.push(component) }

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
