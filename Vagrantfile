# -*- mode: ruby -*-
# vi: set ft=ruby :

ENV["LC_ALL"] = "en_US.UTF-8"
Vagrant.require_version ">= 2.2"

Vagrant.configure("2") do |config|
  # @see https://app.vagrantup.com/generic
  config.vm.box = "geerlingguy/ubuntu2004"
  config.vm.box_check_update = false # check for updates
  config.vm.box_version = "1.0.4"

  config.vm.provision "setup-node-env",
    path: "https://raw.githubusercontent.com/noahehall/theBookOfNoah/master/linux/.install_node.sh",
    preserve_order: true,
    type: "shell"

  config.vm.provision "install-repo-deps",
    inline: "cd /opt/nodeproto && pnpm i",
    preserve_order: true,
    type: "shell"

  config.vm.provision "install-flow-types",
    inline: "cd /opt/nodeproto && pnpm repo:flowtyped:install",
    preserve_order: true,
    type: "shell"

  config.vm.provision "build-repo",
    inline: "cd /opt/nodeproto && pnpm proto:script build",
    preserve_order: true,
    type: "shell"

  config.vm.provision "lint-repo",
    inline: "cd /opt/nodeproto && pnpm proto repo:lint",
    preserve_order: true,
    type: "shell"

  config.vm.provision "test-repo",
    inline: "cd /opt/nodeproto && pnpm proto:script test",
    preserve_order: true,
    type: "shell"

  # config.vm.network "private_network", type: "dhcp" # create a private network for nfs

  # nfs > virtualbox synced folder
  config.vm.synced_folder ".", "/opt/nodeproto"
    # type: "nfs",
    # nfs_export: true,
    # nfs_udp: false,
    # verify_installed: true,
    # linux__nfs_options: ['rw','no_subtree_check','all_squash','async'] # make the NFS share asynchronous

  # virtual box config
  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = "1024" # Customize the amount of memory on the VM:
    vb.cpus = 2 # max cores
    vb.linked_clone = true # the master is generated by importing the base box only once the first time it is required.
    vb.check_guest_additions = true # takes a perf hit but increase stability
    # TODO: set this to like 20 to imitate prod-type resources
    vb.customize ["modifyvm", :id, "--cpuexecutioncap", "70"] # host CPU execution cap of 70%,
  end
end
