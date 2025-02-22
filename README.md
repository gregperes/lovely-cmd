# Lovely CMD - Node.js + TypeScript + PostgreSQL

A **command-line application** that retrieves GitHub user info, stores it in a 
PostgreSQL database, and provides various ways to query and display the data.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Clone and Install](#clone-and-install)
  - [Running Docker Compose](#running-docker-compose)
  - [Environment Variables](#environment-variables)
  - [Database Migrations](#database-migrations)
- [Running the CLI](#running-the-cli)
  - [Available Commands](#available-commands)
- [Testing](#testing)
- [Linting](#linting)
- [License](#license)

---

## Features

1. **Fetch and Store GitHub User Data**  
   - Uses the [GitHub REST API](https://docs.github.com/en/rest) to fetch user 
     info (e.g., name, location, bio, etc.).  
   - Stores this data in a PostgreSQL database.

2. **List Users**  
   - Lists all users or filters by location.

3. **List by Location and/or Programming Language**  
   - Also fetches the programming languages associated with the user’s 
     repositories.  
   - Allows queries by location **and** language.

4. **CLI Interface**  
   - Interact with the application via a simple CLI.

5. **No Classes, Minimal `process.exit()`**  
   - Designed as a functional-style Node.js app.

---

## Requirements

- **Node.js** (>= 20)
- **Docker** (if you want to run PostgreSQL via Docker Compose)
---

## Getting Started

### Clone and Install

1. **Clone this repository**:
```bash
git clone https://github.com/gregperes/lovely-cmd.git
cd lovely-cmd
```

2. **Install dependencies:**
```sh
pnpm install
```

### Running Docker Compose

To quickly set up PostgreSQL locally, run:
```sh
docker compose up -d

```

### Environment Variables

Create .env file at project root with the following vars
```sh
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testdb
DB_USER=postgres
DB_PASS=mysecretpassword
```

These variables will be used by the application to connect to the Postgres database.

### Database Migrations

You can run the database migrations directly via Node (using pg-promise):

```sh
pnpm run migrate
```

This script reads the SQL file in migrations/create_tables.sql and executes it against the database specified by your .env settings.

## Running the CLI

Use npm scripts to run the main file (src/index.ts) through tsx:
```sh
pnpm start <command> [options]
```

### Available Commands

Fetch and store a GitHub user
```sh
pnpm start get gregperes
```

List users
```sh
pnpm start all
```

List users filtered by location
```sh
pnpm start search --loc Portugal

```
List users filtered by language
```sh
pnpm start search --lang PHP
```

List users filtered by location AND language
```sh
pnpm start search --loc USA --lang Rust
```
---

## Testing

This project uses Vitest for testing. Use the command below to execute the tests.

```sh
pnpm test
```
---

## Linting

We use ESLint with some basic TypeScript rules
```sh
pnpm lint
```

Trying to fix usin ESLint
```sh
pnpm lint:fix
```
---

## License
This project is open source under the MIT License.
Feel free to use it as a starting point for your own applications.

Enjoy LOVELY CMD! S2