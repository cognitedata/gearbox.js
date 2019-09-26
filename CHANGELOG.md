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
