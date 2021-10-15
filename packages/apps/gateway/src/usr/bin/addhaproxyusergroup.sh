#!/usr/bin/env bash

ID=haproxy

# ubuntu
groupadd -r $ID \
  && useradd -r -g $ID $ID \
  && mkdir -p /var/lib/$ID \
  && chown -R $ID:$ID /var/lib/$ID

# TODO: alpine

# TODO: create fn that calls one or the other
