# various gateway cross-cutting concerns via [haproxy](https://cbonte.github.io/haproxy-dconv/2.4/intro.html)

# TLDR
  - [dir structure mirrors standard unix filesystem hierarchy](https://help.ubuntu.com/community/LinuxFilesystemTreeOverview#Main_directories)

# about
  - many things can be symlinked from the default locations to their relative locations, e.g. */run/haproxy/admin.sock*
