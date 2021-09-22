# TLDR

logic shared across packages
this package should NEVER depend on other monorepo packages

## about

generally shit ends up in this pkg because

- logic was originally in another package, but needed to be extracted to keep the monorepo DRY and reduce cyclic dependencies
  - ensure you reimport back into the original package under the same name so consumers can have a stable API and we adhere to our contracts
