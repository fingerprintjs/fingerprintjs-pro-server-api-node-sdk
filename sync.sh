#!/bin/bash

curl -o ./resources/fingerprint-server-api.yaml https://fingerprintjs.github.io/fingerprint-pro-server-api-openapi/schemas/fingerprint-server-api-compact.yaml

examplesList=(
  'webhook.json'
  'get_event_200.json'
  'get_event_200_all_errors.json'
  'get_event_200_extra_fields.json'
  'get_event_403_error.json'
  'get_event_404_error.json'
  'get_event_200_botd_failed_error.json'
  'get_event_200_botd_too_many_requests_error.json'
  'get_event_200_identification_failed_error.json'
  'get_event_200_identification_too_many_requests_error.json'
  'get_event_200_identification_too_many_requests_error_all_fields.json'
  'get_visits_429_too_many_requests_error.json'
  'shared/404_error_visitor_not_found.json'
  'shared/400_error_incorrect_visitor_id.json'
  'shared/403_error_feature_not_enabled.json'
  'shared/429_error_too_many_requests.json'
)

for example in ${examplesList[*]}; do
  curl -o ./tests/mocked-responses-tests/mocked-responses-data/external/"$example" https://fingerprintjs.github.io/fingerprint-pro-server-api-openapi/examples/"$example"
done
