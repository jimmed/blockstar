# Blockstar

> Create private lobbies for GTA Online

[![Continuous Integration](https://github.com/jimmed/blockstar/workflows/Continuous%20Integration/badge.svg)](https://github.com/jimmed/blockstar/actions?query=workflow%3A%22Continuous+Integration%22)

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
