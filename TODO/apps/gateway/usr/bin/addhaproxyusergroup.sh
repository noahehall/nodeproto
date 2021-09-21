#!/usr/bin/env bash

ID=haproxy

groupadd -r $ID \
  && useradd -r -g $ID $ID \
  && mkdir -p /var/lib/$ID \
  && chown -R $ID:$ID /var/lib/$ID
