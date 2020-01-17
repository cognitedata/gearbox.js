# Gearbox.js
[![Build Status](https://travis-ci.org/cognitedata/gearbox.js.svg?branch=master)](https://travis-ci.org/cognitedata/gearbox.js)
[![codecov](https://codecov.io/gh/cognitedata/gearbox.js/branch/master/graph/badge.svg)](https://codecov.io/gh/cognitedata/gearbox.js)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://cognitedata.github.io/gearbox.js/?path=/docs/assets-assetbreadcrumb--basic-usage)

[Gearbox](https://github.com/cognitedata/gearbox.js) is a set of open-source front-end components natively integrated with Cognite Data Fusion [(CDF)](https://docs.cognite.com/dev/). 
The Gearbox components are written in the [React](https://reactjs.org) front-end framework and make it easier to build web applications on top of CDF.

## Install the Gearbox library and dependencies

1. Install the library:

- **yarn**: `yarn add @cognite/gearbox`
- **npm**: `npm install @cognite/gearbox --save`

2. Install additional dependencies:

- **yarn**: `yarn add @cognite/sdk @cognite/griff-react@~0.4.2 antd styled-components`
- **npm**: `npm install @cognite/sdk @cognite/griff-react@~0.4.2 antd styled-components --save`


## Getting started
1. Set up the SDK context.

    To set up the SDK context, you need to add in `ClientSDKProvider`. Mount it near the top level and make sure that ALL usages of Gearbox are within this Provider.

    ```js
    import { CogniteClient } from "@cognite/sdk";
    import { ClientSDKProvider } from "@cognite/gearbox";
    
    // ...
    
    const sdk = new CogniteClient({ appId: 'new-app' })
    
    // ...
    
    sdk.loginWithOAuth({ project: tenant }); // or other authentication methods
    
    // ...
    
    <ClientSDKProvider client={sdk}>
    
    // The part of your app that uses Gearbox
    
    </ClientSDKProvider>
    ```

    For more information, see the SDK documentation:

      - [Authentication](https://github.com/cognitedata/cognitesdk-js/blob/HEAD/guides/authentication.md)
      - [SDK Documentation](https://www.npmjs.com/package/@cognite/sdk/)

2. Load the components and start using Gearbox.

    ```js
    import { /* Component_name */ } from "@cognite/gearbox";
    import 'antd/dist/antd.css';
    ```

    or

    ```js
    import * as gearbox from "@cognite/gearbox";
    import 'antd/dist/antd.css';
    ```

    You can also import separate components and reduce the bundle size of your app:

    ```js
    import {
      TenantSelector
    } from "@cognite/gearbox/dist/components/TenantSelector";
    ```
**NOTE:** You MUST use the Gearbox components inside the `ClientSDKProvider`. To learn more about context and why this is important, see [React Context](https://reactjs.org/docs/context.html).  

## Examples and tutorials

You can find example Gearbox applications in our [public repository](https://github.com/cognitedata/javascript-getting-started). Also, see our [YouTube channel](https://www.youtube.com/playlist?list=PLrRAbrQ_glsXGzl5OIen3eSS8bz-YFjTV) for Gearbox video tutorials.

## Storybook
See the up-to-date storybook [here](https://cognitedata.github.io/gearbox.js/?path=/docs/assets-assetbreadcrumb--basic-usage).

## Contribution guidelines

Feel free to contribute to the project, but first have a look at our [guidelines](./CONTRIBUTION.md)

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
