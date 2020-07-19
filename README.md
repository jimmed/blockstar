# Blockstar

> Create private lobbies for GTA Online

[![Client Build](https://github.com/jimmed/blockstar/workflows/Client%20Build/badge.svg)](https://github.com/jimmed/blockstar/actions?query=workflow%3A%22Client+Build%22)
[![Server Build](https://github.com/jimmed/blockstar/workflows/Server%20Build/badge.svg)](https://github.com/jimmed/blockstar/actions?query=workflow%3A%22Server+Build%22)

## Development environment

This monorepo is managed by [rush](https://rushjs.io/).

### Performing a build

```sh
rush build
```

### Running unit tests

```sh
rush test
```

### Creating a new package

```sh
rush create-package --path libraries/new-package --name @blockstar/new-package
```
