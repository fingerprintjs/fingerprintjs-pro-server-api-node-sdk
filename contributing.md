# Contributing to FingerprintJS Server API Node.js SDK

## Working with code

We prefer using [yarn](https://yarnpkg.com/) for installing dependencies and running scripts.

The main branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues, first.

### How to build
Just run:
```shell
yarn build
```

### Code style

The code style is controlled by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Run to check that the code style is ok:
```shell
yarn lint
```

You aren't required to run the check manually, the CI will do it. Run the following command to fix style issues (not all issues can be fixed automatically):
```shell
yarn lint:fix
```

### How to test
Tests are located in `tests` folder and run by [jest](https://jestjs.io/) in node environment.

To run tests you can use IDE instruments or just run:
```shell
yarn test
```

### How to publish

Change version in package.json to x.y.z and push a commit with the message Release x.y.z, the npm-publish action will create a new tag vx.y.z and publish the package to the npm registry.
