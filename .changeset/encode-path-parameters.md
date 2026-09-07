---
'@fingerprint/node-sdk': patch
---

URL-encode path parameters, so an `eventId` or `visitorId` can no longer change which endpoint is requested. Do not pre-encode these values yourself, as they are now encoded for you. A parameter that is `.`, `..`, `null` or cannot be encoded is rejected with a `TypeError` instead of being sent.
