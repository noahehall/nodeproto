# @nodeproto/membrane

- the virtualization layer that separates the interior apps, libraries and tools from the outside environment

## TLDR

TODO: finish tihs

### setting up

- pre-reqs
  - docker installed and running
  - disable any run on boot script and stop the docker daemon
    - `$ sudo systemctl disable docker`
    - `$ sudo systemctl stop docker`
- reqs
  - start docker daemon `$ sudo dockerd --config-file src/daemon.json`
  - confirm can run hello world `$ docker run --rm hello-world`
  - create bridge network `$docker network create proto-net`
  - confirm network is unreachable by default
    - `$ docker run --rm busybox ping -c 1 8.8.8.8`
  - confirm network works via `proto-net`
    - ip addr `$ docker run --rm --net proto-net busybox ping -c 8.8.8.8`
    - domain `$ docker run --rm --net proto-net busybox ping -c google.com`
