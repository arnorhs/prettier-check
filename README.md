# Setup and run prettier with any plugin

**Setup Prettier** is a github action that provides a cross-platform environment to
setup and run prettier --check on your code, using your defined prettier version and dependencies
without custom hacks.

## Why?

I run prettier --check in our CI but I use non-official prettier plugins. This means I can't use
[actions/prettier-action](https://github.com/marketplace/actions/prettier-action) to check the
code, because that seems to only support bundled prettier plugins (ie. `@prettier/plugin-*`)

So what I was doing was just running prettier directly after installing before the rest of the
code actions. But I like to run prettier as a separate job, but when doing that you need to
basically install everything, and re-use any caches etc and it just requires a bunch of setup
and hassle.

So this is an attempt at basically setting up only prettier and the related plugins in a relatively
light-weight fashion.

## Usage

To use this action in your github workflows:

```yml

```

## Limitations

This action only supports checking prettier for formatting, not running it and committing.
