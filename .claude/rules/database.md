---
globs: src/models/**
---
# Database Rules

## Schema conventions

- Use snake_case for table and column names.
- Every table must have a primary key.
- Add created_at and updated_at timestamps to all tables.
- Use explicit foreign key constraints.

## Migrations

- Migrations must be reversible — include both up and down.
- Never modify a migration that has been applied to production.
- Test migrations against a copy of production data when possible.

## Query safety

- Always use parameterized queries — never string concatenation.
- Add indexes for columns used in WHERE, JOIN, and ORDER BY clauses.
- Monitor and optimize slow queries (>100ms).

## Data integrity

- Validate data at the application layer AND the database layer.
- Use transactions for multi-step operations.
- Implement soft deletes where audit trails are needed.
