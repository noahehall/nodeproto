#!/usr/bin/env bash

# @see https://stackoverflow.com/questions/10628275/how-to-use-curl-with-django-csrf-tokens-and-post-requests


echo -e "\n logging in\n"
curl -v \
  -c ./examples/cookies.txt \
  -b ./examples/cookies.txt \
  localhost:3000/logging/in

# TODO(noah)
# +didnt finish csrf token shit in creating shit call
# +so this POST is broken as it requires a valid csrf token
echo -e "\n\n creating shit\n"
curl -v \
  -c ./examples/cookies.txt \
  -b ./examples/cookies.txt \
  -d "name=test" \
  localhost:3000/create/shit

echo -e '\n\n'
