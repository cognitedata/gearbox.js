<a href="https://cognite.com/">
    <img src="./cognite_logo.png" alt="Cognite logo" title="Cognite" align="right" height="80" />
</a>

Gearbox.js
==========================
[![Build Status](https://travis-ci.org/cognitedata/gearbox.js.svg?branch=master)](https://travis-ci.org/cognitedata/gearbox.js)
[![codecov](https://codecov.io/gh/cognitedata/gearbox.js/branch/master/graph/badge.svg)](https://codecov.io/gh/cognitedata/gearbox.js)

## Description

Gearbox is a set of React components natively integrated with Cognite Data Fusion [(CDF)](https://cognite.com/cognite/cognite-data-fusion/). Gearbox was built to make it easier to build web applications on top of CDF. We have also created some example applications using gearbox that you can find [here](https://github.com/cognitedata/javascript-getting-started).

## Install

Run `yarn add @cognite/gearbox` or `npm install @cognite/gearbox --save`.

Install additional dependencies:
1.  Using Yarn `yarn add @cognite/sdk @cognite/griff-react antd styled-components`
2.  Using NPM `npm i @cognite/sdk @cognite/griff-react antd styled-components --save`

## Examples

### TODO ADD ACTUAL DESCRIPTION

```js
import { %Component_name% } from "@cognite/gearbox";
import 'antd/dist/antd.css';
```
or
```js
import * as gearbox from "@cognite/gearbox";
import 'antd/dist/antd.css';
```
You can also import separate components. This approach reduces bundle size of your app:
```js
import {
  TenantSelector
} from "@cognite/gearbox/dist/components/TenantSelector";
```

## Storybook

See the up-to-date storybook [here](https://cognitedata.github.io/gearbox.js).

## Development

#### Requirements

To build the library locally it's required to have version of `node` installed not lower than `10.10`

## Tests

Utilising Jest and Enzyme you can test your component

Run `yarn test`

## Deploy

We use [Semantic Versioning 2.0.0](https://semver.org/) for the package version.

To deploy a new version to NPM follow these steps:
1. Create a new branch from the `master` branch.
2. Do any neccessary changes (if any).
3. Bump version -> run `$ npm version patch|minor|major`. Example: `$ npm version minor`.
4. Push branch to GitHub
5. Create pull request and prefix the PR-name with `v{YOUR_VERSION} - {NAME}` (example: `v1.5.2 - My PR`)
6. Ask for review and merge when approved
7. Travis will automatically deploy the new version to https://www.npmjs.com/package/@cognite/gearbox

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
