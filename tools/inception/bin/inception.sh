#!/usr/bin/env bash

echo `pnpm root` # check for existence of rc/lock file, then use this
echo `yarn global bin` # if yarn.lock exists, use this
echo `npm root -g` # in all other cases, use this

echo "dry install --dry-keep-package-json --dry-packager=npm"
