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

### Release to NPM

Our releases are fully [automated](https://github.com/semantic-release/semantic-release).
Only basic steps are needed:

1. Create a new branch from the `master` branch.
2. Commit changes and remember about [proper commit messages](#commit-naming-conventions)
3. Push branch to GitHub
4. Open a new pull request, ask for review, get feedback, apply fixes if needed
5. When PR is approved you can merge the branch and remove it afterwards
5. A new version will be published shortly to https://www.npmjs.com/package/@cognite/gearbox 

