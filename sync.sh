#!/bin/bash

curl -o ./resources/fingerprint-server-api.yaml https://fingerprintjs.github.io/fingerprint-pro-server-api-openapi/schemas/fingerprint-server-api-compact.yaml

examplesList=(
  'webhook.json'
  'get_event_200.json'
  'get_event_200_all_errors.json'
  'get_event_200_extra_fields.json'
  'get_event_403_error.json'
  'get_event_404_error.json'
)

for example in ${examplesList[*]}; do
  curl -o ./tests/mocked-responses-tests/mocked-responses-data/external/"$example" https://fingerprintjs.github.io/fingerprint-pro-server-api-openapi/examples/"$example"
done
