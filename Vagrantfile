# -*- mode: ruby -*-
# vi: set ft=ruby :

ENV["LC_ALL"] = "en_US.UTF-8"
Vagrant.require_version ">= 2.2"

Vagrant.configure("2") do |config|
  # @see https://app.vagrantup.com/generic
  # config.vm.box = "geerlingguy/ubuntu2004"
  # config.vm.box = "./ubuntu-20-04-nodejs-pnpm.box"
  config.vm.box = "thedragon/ubuntu-20-04-nodejs-pnpm"
  config.vm.box_check_update = false # check for updates
  # config.vm.box_version = "1.0.4"

  config.vm.provision "ubuntu-update-upgrade",
    inline: "apt update && apt upgrade -y",
    run: "always",
    preserve_order: true,
    type: "shell",
    privileged: true

  # config.vm.provision "install-missing-flow-dependencies",
  #   inline: "apt install -y libatomic1",
  #   preserve_order: true,
  #   type: "shell",
  #   privileged: true

  # config.vm.provision "setup-node-env",
  #   path: "https://raw.githubusercontent.com/noahehall/theBookOfNoah/master/linux/.install_node_ci.sh",
  #   preserve_order: true,
  #   type: "shell",
  #   privileged: false,
  #   name: 'setup-node'

  config.vm.provision "create-dir-var-nodeproto",
    inline: "install -d -o vagrant -g vagrant /var/.nodeproto",
    preserve_order: true,
    type: "shell",
    privileged: true

  config.vm.provision "install-nodeproto-dependencies",
    inline: "cd /opt/nodeproto && pnpm i --no-lockfile",
    preserve_order: true,
    privileged: false,
    type: "shell"

  config.vm.provision "install-flow-types",
    inline: "cd /opt/nodeproto && pnpm proto repo:flowtyped:install",
    preserve_order: true,
    privileged: false,
    type: "shell"

  config.vm.provision "build-repo",
    inline: "cd /opt/nodeproto && pnpm proto:script build",
    preserve_order: true,
    privileged: false,
    type: "shell"

  config.vm.provision "lint-repo",
    inline: "cd /opt/nodeproto && pnpm proto repo:lint",
    preserve_order: true,
    privileged: false,
    type: "shell"

  config.vm.provision "test-repo",
    inline: "cd /opt/nodeproto && pnpm proto:script repo:test",
    preserve_order: true,
    privileged: false,
    type: "shell"

  # config.vm.network "private_network", type: "dhcp" # create a private network for nfs

  # nfs > virtualbox synced folder
  config.vm.synced_folder ".", "/opt/nodeproto"
    # disabled: true
    # type: "nfs",
    # nfs_export: true,
    # nfs_udp: false,
    # verify_installed: true,
    # linux__nfs_options: ['rw','no_subtree_check','all_squash','async'] # make the NFS share asynchronous

  # virtual box config
  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    # vb.memory = "1024" # Customize the amount of memory on the VM:
    # vb.cpus = 2 # max cores
    # vb.linked_clone = true # the master is generated by importing the base box only once the first time it is required.
    vb.check_guest_additions = false # dont set true in ci
    vb.customize ["modifyvm", :id, "--cpuexecutioncap", "90"] # host CPU execution cap of 70%,
  end
end
