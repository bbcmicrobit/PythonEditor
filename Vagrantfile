# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/trusty64"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.provision "shell", inline: <<-SHELL
        add-apt-repository ppa:jonathonf/python-3.6
        apt-get update
        apt-get upgrade --assume-yes
        apt-get install --assume-yes \
            git \
            vim \
            python3.6
        apt-get autoremove --assume-yes
    SHELL
    config.vm.provision "shell", privileged: false, inline: <<-SHELL
        cd /vagrant
        git submodule update --init --recursive
    SHELL
end
