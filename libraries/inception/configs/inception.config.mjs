export const inceptionBaseConfig = {
    built: false,
    depsDownstream: new Set(), // we depend on these
    depsDownstreamLinked: false,
    depsUpstream: new Set(), // they depenend on us
    pkgJson: {},
    published: false,
    running: false,
  };