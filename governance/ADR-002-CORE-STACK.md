# ADR-002: Core Technology Stack

## Context
The project requires a monolithic repository containing React frontends (admin and catalog), a Node.js API, and a PostgreSQL database. The backend needs to enforce row-level versioning, decimal precision for currency, and robust auth/audit logging.

## Decision
- **Package Manager**: npm (v10+), using npm workspaces.
- **Language**: TypeScript (v5.6.2).
- **Frontend**: React (v18.3.1), react-dom, react-router-dom. Vite for bundling.
- **Backend**: Node.js (v24). Express for HTTP framework, or basic node HTTP. We will use `pg` driver and Drizzle ORM (v0.33) for migrations and querying to ensure typed SQL.
- **Database**: PostgreSQL 16+.
- **Decimals**: We will use `decimal.js` for accurate financial mathematics in JS. Currency is stored as `bigint` for VND in the DB, or numeric fields, but serialized as string/decimal in API responses.
- **Testing**: Node's native `node:test` and `node:assert` for unit and integration testing to avoid heavy Jest/Vitest setups initially, keeping it simple and fast.
- **Linting**: ESLint flat config.

## Status
Accepted

## Consequences
We need to ensure `npm ci` is used with the generated `package-lock.json`. We will write tests using `node:test` for domain logic.
