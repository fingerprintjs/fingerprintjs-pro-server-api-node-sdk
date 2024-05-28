# Contributing to FingerprintJS Server API Node.js SDK

## Working with code

We prefer using [pnpm](https://pnpmpkg.com/) for installing dependencies and running scripts.

The main branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues, first.

### How to regenerate the types

Run the following command that will regenerate types:

```shell
pnpm generateTypes
```

It uses schema stored in [res/schema.json](resources/fingerprint-server-api.yaml). To fetch the latest schema run:

```shell
./sync.sh
```

### How to build

Just run:

```shell
pnpm build
```

### Code style

The code style is controlled by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Run to check that the code style is ok:

```shell
pnpm lint
```

You aren't required to run the check manually, the CI will do it. Run the following command to fix style issues (not all issues can be fixed automatically):

```shell
pnpm lint:fix
```

### Running tests

Tests are located in `tests` folder and run by [jest](https://jestjs.io/) in node environment.

To run tests you can use IDE instruments or just run:

```shell
pnpm test
```

### Testing the local source code of the SDK

Use the `example` folder to make API requests using the local version of the SDK. The [example/package.json](./example/package.json) file reroutes the SDK import references to the project root folder.

1. Create an `.env` file inside the `example` folder according to [.env.example](/example/.env.example).
2. Install dependencies and build the SDK (inside the root folder):

   ```shell
   pnpm install
   pnpm build
   ```

3. Install dependencies and run the example (inside the `example` folder)):

   ```shell
   cd example
   pnpm install
   node index.js
   ```

Every time you change the SDK code, you need to rebuild it in the root folder using `pnpm build` and then run the example again.

### How to publish

The library is automatically released and published to NPM on every push to the main branch if there are relevant changes using [semantic-release](https://github.com/semantic-release/semantic-release) with following plugins:

- [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer)
- [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator)
- [@semantic-release/changelog](https://github.com/semantic-release/changelog)
- [@semantic-release/npm](https://github.com/semantic-release/npm)
- [@semantic-release/github](https://github.com/semantic-release/github)

The workflow must be approved by one of the maintainers, first.
