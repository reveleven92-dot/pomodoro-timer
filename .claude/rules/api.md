---
globs: src/api/**
---
# API Rules

## Endpoint conventions

- Use RESTful naming: nouns for resources, HTTP verbs for actions.
- Version APIs in the URL path (e.g., `/api/v1/`).
- Return consistent response envelopes: `{ data, error, meta }`.

## Input validation

- Validate all request parameters at the handler level.
- Return 400 with specific field-level error messages for bad input.
- Sanitize inputs to prevent injection attacks.

## Authentication & authorization

- Verify auth tokens on every protected endpoint.
- Use middleware for auth checks — don't repeat in handlers.
- Return 401 for missing auth, 403 for insufficient permissions.

## Rate limiting

- Apply rate limits on public-facing endpoints.
- Return 429 with Retry-After header when rate-limited.
