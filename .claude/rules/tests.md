---
globs: tests/**
---
# Test Rules

## Test structure

- One test file per source module, mirroring the source directory layout.
- Name test files with a `test_` prefix (Python) or `.test.` infix (JS/TS).
- Group related tests with descriptive describe/class blocks.

## Test quality

- Every test must assert something specific — no tests that just "don't throw."
- Test behavior, not implementation details.
- Name tests descriptively: `test_returns_404_when_user_not_found`.

## Coverage requirements

- Minimum 80% line coverage.
- Every new feature must include: 1 happy path + 3 negative scenarios.
- Cover edge cases: empty inputs, null values, boundary conditions.

## Test isolation

- Tests must not depend on each other or on execution order.
- Clean up any test data or side effects in teardown.
- Mock external services — tests must not make real network calls.
