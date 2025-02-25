# Movie API

A TypeScript-based Movie API service that provides movie-related functionalities.

## Description

This project is a Movie API Code Test that demonstrates building a RESTful API service for managing movie data using TypeScript and SQLite.

## Tech Stack

- TypeScript
- SQLite3 for database
- Zod for validation
- Jest for testing

## Installation
Using [asdf](https://asdf-vm.com/) for managing Node.js versions. This project is using Node.js v18.17.1.

```bash
npm install
```

## Environment Variables
Using [direnv](https://direnv.net/) to manage environment variables is recommended.

```bash
cp .envrc.example .envrc
```

## Available Scripts

- `npm start` - Runs the compiled application from the dist folder
- `npm run dev` - Starts the development server with hot-reload
- `npm run build` - Compiles TypeScript code to JavaScript
- `npm test` - Runs all tests
- `npm run test:watch` - Runs tests in watch mode
- `npm run test:coverage` - Generates test coverage report
- `npm run test:clear` - Clears Jest cache

## Project Structure

```
movie-api/
├── documentation/            # Documentation
├── db/                       # Database files
├── src/                      # Source code
│   ├── movies-management/    # Movies management
│   │   ├── helpers/          # Helpers
│   │   ├── routes/           # Routes
│   │   ├── services/         # Services
│   │   ├── models/           # Models
│   │   ├── validations/      # Validations
│   ├── ratings-management/   # Ratings management
│   │   ├── helpers/          # Helpers
│   │   ├── routes/           # Routes
│   │   ├── services/         # Services
│   │   ├── models/           # Models
│   │   ├── validations/      # Validations
│   ├── shared/               # Shared code
│       ├── helpers/          # Helpers
│   ├── tests/                # Test files
│   │   ├── unit/             # Unit tests
│   │   ├── integration/      # Integration tests
└── package.json              # Project dependencies and scripts
```

## Dependencies

### Main Dependencies
- `sqlite3` - SQLite database driver
- `zod` - TypeScript-first schema validation

### Development Dependencies
- `typescript` - JavaScript with syntax for types
- `jest` - Testing framework
- `ts-jest` - Jest transformer for TypeScript
- `ts-node-dev` - Development server with reload capability
