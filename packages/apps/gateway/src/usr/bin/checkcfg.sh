#!/usr/bin/env bash

haproxy -c -f packages/gateway/src/etc/haproxy/haproxy.cfg
