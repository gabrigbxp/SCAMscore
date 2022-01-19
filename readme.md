# How to run project

- Install using [yarn](https://classic.yarnpkg.com/en/docs/install)
- Use `yarn ts` to compile (and watch) the code
- Run using `yarn dev` (watch with nodemon)
- Use `yarn start` to compile and run the server (no watch)
- Environment variables required (`.env` file accepted)
  1. PORT: port for express server (8000 by default)
  2. API_KEY: for scamadviser
  3. PGDATABASE
  4. PGHOST
  5. PGUSER
  6. PGPASSWORD
  7. PGPORT

# Table
Import the file `score` to your database (already has information for testing)

# Endpoint
The endpoint is http://localhost:(SERVER PORT)/api?domain=(DOMAIN TO CHECK)&from=(DATE IN YYYY-MM-DD)&to=(DATE IN YYYY-MM-DD)
`from` and `to` are optionals

# I NEVER USED POSTGRESQL BEFORE!