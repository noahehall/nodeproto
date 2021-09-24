#!/usr/bin/env bash

ID=haproxy

sudo ln -s /usr/sbin/$ID ./usr/bin/$ID
sudo chown -h $ID:$ID ./usr/bin/$ID
