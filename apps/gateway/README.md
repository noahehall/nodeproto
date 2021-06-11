# various gateway cross-cutting concerns via [haproxy](https://cbonte.github.io/haproxy-dconv/2.4/intro.html)
  - [install steps](https://haproxy.debian.net/#?distribution=Ubuntu&release=focal&version=2.4)

# TLDR
  - [dir structure mirrors standard unix filesystem hierarchy](https://help.ubuntu.com/community/LinuxFilesystemTreeOverview#Main_directories)

# env vars
  - set them in `./etc/default/haproxy` and it should be picked up in the init & configuration files
# about
  - many things can be symlinked from the default locations to their relative locations, e.g. */run/haproxy/admin.sock*


# quickies
  - `lsof -i :PORT`
  - `pgrep PROCNAME`
  - `sudo kill PID`
