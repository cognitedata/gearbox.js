## Contribution

### Development

To build the library locally it's required to have version of `node` installed not lower than `10.10`

### Commit naming conventions

We use [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

Examples of a proper commit message:
`feat(AssetMeta): added a new "isCollapsed" property`
or
`fix: proper components behaviour on mobile`

Here is a short cheat sheet of available options:

* `feat(pencil):` A new feature
* `fix:` A bug fix
* `docs:` Documentation only changes
* `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* `refactor:` A code change that neither fixes a bug nor adds a feature
* `perf:` A code change that improves performance
* `test:` Adding missing or correcting existing tests
* `chore:` Changes to the build process or auxiliary tools and libraries such as documentation generation

### Tests

Utilising Jest and Enzyme you can and should test your component

Run `yarn test`

### Deploy

We use [Semantic Versioning 2.0.0](https://semver.org/) for the package version.

To deploy a new version to NPM follow these steps:
1. Create a new branch from the `master` branch.
2. Do any neccessary changes (if any).
3. Bump version -> run `$ npm version patch|minor|major`. Example: `$ npm version minor`.
4. Push branch to GitHub
5. Create pull request and prefix the PR-name with `v{YOUR_VERSION} - {NAME}` (example: `v1.5.2 - My PR`)
6. Ask for review and merge when approved
7. Travis will automatically deploy the new version to https://www.npmjs.com/package/@cognite/gearbox
