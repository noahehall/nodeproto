#!/usr/bin/env sh

# always do this
# dry --dry-keep-package-json --dry-packager=pnpm

dry --dry-keep-package-json --dry-packager=pnpm "$*"
