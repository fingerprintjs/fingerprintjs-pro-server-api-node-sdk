---
"@fingerprintjs/fingerprintjs-pro-server-api": minor
---

Update Server API schema to v3.7.1:

- Require `label` on `Labels`
- Add `RequestReadTimeout` to `ErrorCode`
- Add `404`, `429`, and `504` responses to `GET /events/search` and `GET /visitors/{visitor_id}`
- Clarify that `reverse` on `GET /events/search` defaults to `false` (sorts newest first)
- Clarify that `GET /visitors/{visitor_id}` currently returns at most one item in `visits`, and deprecate its `limit`/`paginationKey`/`before` pagination parameters in favor of `GET /events/search`
