#!/usr/bin/env bash

install_dev_tools () {
  echo -e "\t$(whoami): setting up development tools"

  cat > /etc/apk/repositories << EOF; $(echo)
http://dl-cdn.alpinelinux.org/alpine/v$(cat /etc/alpine-release | cut -d'.' -f1,2)/main
http://dl-cdn.alpinelinux.org/alpine/v$(cat /etc/alpine-release | cut -d'.' -f1,2)/community
EOF

  apk update

  # TODO: forces use to use haproxy 2.4.4; create a build script
  # TODO: this forces us to use the latest (whatever) nodejs: create a build script
  # nfs-common portmap both for NFS file sharing
  # ^ necessary evils until we find the time to focus on this
  apk add --no-cache \
    attr \
    bash bash-completion \
    binutils \
    curl \
    findutils \
    git=2.32.0-r0 \
    grep \
    less \
    lsof \
    nano \
    openssh \
    readline \
    sed \
    util-linux \
    haproxy \
    npm \
    nodejs-current


  # @see https://unix.stackexchange.com/questions/94490/bash-doesnt-read-bashrc-unless-manually-started
  echo  'test -f ~/.bashrc && . ~/.bashrc' > "/home/vagrant/.bash_profile"
  echo "export PATH=$PATH:/home/vagrant/.local/share/pnpm" > "/home/vagrant/.bashrc"
}

# @see https://medium.com/@dtinth/isolating-node-modules-in-vagrant-9e646067b36
bindmount_node_modules () {
  echo -e "\t$(whoami)-$(id): creating variable dir @ /var/.nodeproto"
  sudo mkdir -p /var/.nodeproto
  sudo chown -R vagrant:vagrant /var/.nodeproto

  # we dont need to bindmount: read the docs, not the blogs
  # sudo mount --bind /var/.nodeproto/node_modules /opt/nodeproto/node_modules
}

# @see https://stackoverflow.com/questions/35628656/how-execute-commands-as-another-user-during-provisioning-on-vagrant
install_pnpm () {
  sudo -u vagrant "$SHELL" <<\EOF
  echo -e "\t$(whoami)-$(id): installing pnpm"
  mkdir -p $HOME/.local/share/pnpm
  curl -fsSL 'https://github.com/pnpm/pnpm/releases/download/v6.22.2/pnpm-linuxstatic-x64' -o $HOME/.local/share/pnpm/pnpm \
    && chmod +x $HOME/.local/share/pnpm/pnpm
  . ~/.bashrc
  # this fails with "pnpm: error: no such file or directory" whenever we try to execute the node binary
  # pnpm env use --global 17

EOF

  # doesnt work @see https://github.com/noahehall/nodeproto/issues/184
  # curl -fsSL https://get.pnpm.io/install.sh | sh -
}

install_dev_tools
bindmount_node_modules
install_pnpm

echo -e "\t\twelcome to @nodeproto: the future is yours.
           this provisioning script is meant for development and application appliances
           log into your new machine via:
           \t $ vagrant ssh
           \t $ cd /opt/nodeproto
           If this is your first time, ensure bind mount the root node_modules dir
           \t TODO"
