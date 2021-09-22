# TLDR

logic shared across packages
this package should NEVER depend on other monorepo packages

## about

generally shit ends up in this pkg because

- logic was originally in another package, but needed to be extracted to keep the monorepo DRY and reduce cyclic dependencies
  - you should put the extractd logic within a folder indicating its original package
  - that way we can:
    - reimport (and remember why in the future) back into the original package for consumers without them knowing of the change
    - reiuse it elseware
      - e.g. wtf & jsync both import from this package, when before they were importing from eachother creating a cyclic dependency
