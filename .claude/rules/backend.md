---
globs: src/backend/**
---
# Backend Rules

## Architecture

- Keep business logic separate from transport layer (HTTP handlers, CLI).
- Use dependency injection for external services (DB, APIs, queues).
- Each module should have a clear, single responsibility.

## Error handling

- Return structured errors with error codes, not raw strings.
- Log errors with context (request ID, user ID, operation name).
- Never swallow errors silently.

## Data access

- Use parameterized queries — never string-concatenate SQL.
- Validate all inputs at the service boundary.
- Keep database transactions short.

## Configuration

- Read config from environment variables or config files — never hardcode.
- Validate required config on startup, fail fast if missing.
