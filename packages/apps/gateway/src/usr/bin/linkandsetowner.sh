#!/usr/bin/env bash

ID=haproxy

sudo ln -s /usr/sbin/$ID ./src/usr/bin/$ID
sudo chown -h $ID:$ID ./src/usr/bin/$ID
