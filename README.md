<a href="https://cognite.com/">
    <img src="./cognite_logo.png" alt="Cognite logo" title="Cognite" align="right" height="80" />
</a>

TenantSelector

Provide a reusable component to allow the user to choose their CDP tenant.
This component's functionality is described in the storybook, but supports the following options:

```javascript
<TenantSelector
  onTenantSelected={(tenant, durationMillis) => void}
  title="Title of the application"
  validateTenant={tenant => Promise.resolve(tenant.length % 2 === 0)}

  // All of these are optional.
  header="Some header text"
  initialTenant="cognite"
  loginText="Text on the login button"
  onInvalidTenant={(tenant, durationMillis) => void}
  placeholder="Enter some tenant name"
  unknownMessage="You entered an unknown tenant"
/>
```

==========================

## Setup

Run `yarn`

## Run

Run `yarn start`

## Storybook

To showcase your component you can use storybooks by introducing different stories for your component

Run `yarn storybook`

## Tests

Utilising Jest and Enzyme you can test your component

Run `yarn test`

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Release

On a main brunch merge package will be automatically published to npm with updating patch version

Run `yarn publish-module`
