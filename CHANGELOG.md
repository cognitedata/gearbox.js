# [1.5.0](https://github.com/cognitedata/gearbox.js/compare/v1.4.0...v1.5.0) (2019-10-21)


### Features

* **description list:** add categorization options ([e2df3e7](https://github.com/cognitedata/gearbox.js/commit/e2df3e7faef2df503b1db31385c3b95b79526845))

# [1.4.0](https://github.com/cognitedata/gearbox.js/compare/v1.3.3...v1.4.0) (2019-10-21)


### Features

* **timeseries data export:** added a component to export timeseries datapoints in CSV format ([1f16607](https://github.com/cognitedata/gearbox.js/commit/1f166075199900b0ee685bd0ecb941a8733a0174))

## [1.3.3](https://github.com/cognitedata/gearbox.js/compare/v1.3.2...v1.3.3) (2019-10-16)


### Bug Fixes

* **AsseTree:** onSelect was being called with wrong parameters ([768fda1](https://github.com/cognitedata/gearbox.js/commit/768fda157e8228fef2d58f3011a45e149e5c89a7))

## [1.3.2](https://github.com/cognitedata/gearbox.js/compare/v1.3.1...v1.3.2) (2019-09-30)


### Bug Fixes

* removed close button when handleCancel is not set ([#446](https://github.com/cognitedata/gearbox.js/issues/446)) ([547820a](https://github.com/cognitedata/gearbox.js/commit/547820a))

## [1.3.1](https://github.com/cognitedata/gearbox.js/compare/v1.3.0...v1.3.1) (2019-09-27)


### Bug Fixes

* assetTree will re-render when displayName prop is changed ([e893a2e](https://github.com/cognitedata/gearbox.js/commit/e893a2e))

# [1.3.0](https://github.com/cognitedata/gearbox.js/compare/v1.2.0...v1.3.0) (2019-09-26)


### Features

* Added new displayName prop to AssetTree ([c4c7f7c](https://github.com/cognitedata/gearbox.js/commit/c4c7f7c))

# Migrating from Gearbox v0.x.x and below to v1.0.0

There's been an architectural change since v0.x.x. This is because the `@cognite/sdk` Gearbox uses is now v2.0.0+. Read more about the change [here](https://www.npmjs.com/package/@cognite/sdk)

While all components still take and accept the same parameters as v0.x.x, the new version requires a global `<ClientSDKProvider>` to be top level (above in DOM hierarchy) to the components you use. The ClientSDKProvider now will have to also take in a `client` parameter, that has to be an instance of `CogniteClient`.

For example, in pre-v1.0.0, you have to load in a component like:

```js
import { Component } from 'react';
import { EventPreview } from '@cognite/gearbox';

class App extends Component {
    render() {
        return (
            <>
                ...
                <Page1 />
            </>
        );
    }
}

class Page1 extends Component {
    render() {
        return (
            <>
                ...
                <EventPreview />
            </>
        );
    }
}
```

now would become


```js
import { Component } from 'react';
import { EventPreview, ClientSDKProvider } from '@cognite/gearbox'; //
import { CogniteClient } from '@cognite/sdk'; // v2.0.0+
// ...
const sdk = new CogniteClient({ appId: 'sample-app' })
// ...
class App extends Component {
    render() {
        return (
            <ClientSDKProvider client={sdk}>
                ...
                <Page1 />
            </ClientSDKProvider>
        );
    }
}

class Page1 extends Component {
    render() {
        return (
            <>
                ...
                <EventPreview />
            </>
        );
    }
}
```

As you can see, the SDK instance has to be passed in now. This is through the `React.Context` pattern, read more about it [here](https://reactjs.org/docs/context.html)

Aside from this, you can expect all previous functionality to continue to work.
