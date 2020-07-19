# TypeScript Monorepo Template

![](https://github.com/jimmed/rush-monorepo-ts/workflows/Unit%20tests/badge.svg)

## Using the template

Rush must be installed globally.

1. [Create a new repository based on this template](https://github.com/jimmed/rush-monorepo-ts/generate)

2. Set the npm scope

   ```sh
   # Set the scope to '@myco'
   sed -i "s/@scope/@myco/" *.* **/*.*
   ```

   - [About npm scopes](https://docs.npmjs.com/about-scopes)

3. Set the registry URL

   ```sh
   # Set the repository to 'https://github.com/org/repo'
   sed -i "s/jimmed\/rush-monorepo-ts/org\/repo/" *.* **/*.*
   ```

4. Update rush manifests

   ```sh
   rush update
   ```

## Performing a build

```sh
rush build
```

## Running unit tests

```sh
rush test
```

## Creating a new package

```sh
rush create-package --path libraries/new-package --name @scope/new-package
```
