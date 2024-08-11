
# TypeScript Project Setup Tutorial


<details>
  <summary><strong>Basic Setup (click to expand)</strong></summary>

## Navigation
- [Setting Up the Project](#setting-up-the-project)
- [Adding Security Features](#adding-security-features)
- [Setting Up Logging with Winston](#setting-up-logging-with-winston)
- [Adding Monitoring Capabilities with Morgan](#adding-monitoring-capabilities-with-morgan)
- [Adding Reloading Capabilities](#adding-reloading-capabilities)
- [Code Standards](#code-standards)
- [Basic Unit Test Setup for Service Logic](#basic-unit-test-setup-for-service-logic)

## Setting Up the Project

In this chapter, we'll start by setting up a basic Express TypeScript project. This will include installing necessary dependencies and setting up TypeScript.

## 1 Initialize the Project

First, create a new directory for your project and navigate into it:

```bash
mkdir express-typescript-app
cd express-typescript-app
```

Initialize a new Node.js project:

```bash
npm init -y
```

## 2 Install Dependencies

Install Express and TypeScript along with the necessary types and development tools:

```bash
npm install express
npm install typescript @types/express ts-node --save-dev
```

## 3 Set Up TypeScript Configuration

Create a `tsconfig.json` file to configure TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 4 Create Basic Project Structure

Create the following directory structure:

```
express-typescript-app/
├── src/
│   └── index.ts
├── dist/
├── .gitignore
├── package.json
└── tsconfig.json
```

## 5 Create the Main Entry Point

In `src/index.ts`, set up a basic Express server:

```typescript
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

## 6 Add Build and Start Scripts

Update your `package.json` to include build and start scripts:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "ts-node src/index.ts"
}
```

You can now build your project with `npm run build`, start it with `npm start`, or run it in development mode with `npm run dev`.

This completes the setup for a basic Express TypeScript application.



## Adding Security Features

In this chapter, we'll add some basic security features to our Express TypeScript application. This includes setting HTTP headers, enabling CORS, and using environment variables for configuration.

## 1 Install Security Dependencies

First, install some commonly used security middleware:

```bash
npm install helmet cors dotenv
npm install @types/cors @types/dotenv --save-dev
```

## 2 Configure Environment Variables

Create a `.env` file in the root of your project to store environment variables. Add the following content:

```
PORT=3000
```

Add `.env` to your `.gitignore` file to prevent it from being committed to version control:

```
/node_modules
/dist
.env
```

## 3 Set Up Helmet and CORS Middleware

In `src/index.ts`, update your server configuration to use Helmet and CORS:

```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

### Explanation

- **Helmet**: Helmet helps secure your Express apps by setting various HTTP headers. It includes a collection of smaller middleware functions that set security-related HTTP headers.
- **CORS**: Cross-Origin Resource Sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain. The `cors` package provides a middleware to enable CORS with various options.

## 4 Using Environment Variables

We've already set up the `dotenv` package to load environment variables from a `.env` file. Using environment variables helps keep sensitive information like configuration settings out of your source code.

You can now access these variables using `process.env`.

### Example: Using Environment Variables

In your `src/index.ts`, you can access the `PORT` environment variable like this:

```typescript
const port = process.env.PORT || 3000;
```

This completes the setup for adding basic security features to our Express TypeScript application.

## Setting Up Logging with Winston

In this chapter, we'll add logging capabilities to our Express TypeScript application using `winston` for more advanced logging features.

## 1 Install Winston

First, install `winston`:

```bash
npm install winston
npm install @types/winston --save-dev
```

## 2 Create a Logger Configuration File

Create a new file `src/logger.ts` to configure Winston:

```typescript
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

export default logger;
```

### Explanation

- **createLogger**: Creates a new logger instance.
- **level**: Sets the logging level. The logger will only log messages at this level or higher.
- **format**: Defines the format for log messages. Here, it's combining a timestamp and a custom printf format.
- **transports**: Defines where to log messages. In this case, to the console and to files (one for errors and one for all logs).

## 3 Logger Levels in Winston

Winston has several logging levels, each with a specific priority. The levels are:

- **error**: Priority 0, for logging error messages.
- **warn**: Priority 1, for logging warning messages.
- **info**: Priority 2, for logging informational messages.
- **http**: Priority 3, for logging HTTP requests (not used by default).
- **verbose**: Priority 4, for logging verbose messages.
- **debug**: Priority 5, for logging debug messages.
- **silly**: Priority 6, for logging everything, including silly messages.

You can set the logging level when creating the logger, and it will log messages at that level and above. For example, if the level is set to `info`, it will log `info`, `warn`, and `error` messages, but not `debug` or `silly` messages.

### Example Usage

Here's an example of how you might use the different logging levels in your application:

```typescript
logger.error('This is an error message');
logger.warn('This is a warning message');
logger.info('This is an informational message');
logger.verbose('This is a verbose message');
logger.debug('This is a debug message');
logger.silly('This is a silly message');
```

This completes the setup for adding logging capabilities to our Express TypeScript application using Winston.


## Adding Monitoring Capabilities with Morgan

In this chapter, we'll add monitoring capabilities to our Express TypeScript application using `morgan` for HTTP request logging.

## 1 Install Monitoring Dependencies

First, install `morgan` for HTTP request logging:

```bash
npm install morgan
npm install @types/morgan --save-dev
```

## 2 Create a Morgan Configuration File

Create a new file `src/morganConfig.ts` to configure Morgan:

```typescript
import morgan from 'morgan';
import logger from './logger';

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export default morganMiddleware;
```

## 3 Set Up Morgan in the Express App

Update your `src/index.ts` to use `morganMiddleware`:

```typescript
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import morganMiddleware from './morganConfig';
import logger from './logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// HTTP request logging with Morgan
app.use(morganMiddleware);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define the error type (you can extend it if needed)
interface Error {
  message: string;
  status?: number;
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(err.status || 500).send('Something went wrong!');
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

export default app; // Export app for use in metrics setup
```

### Explanation

- **Morgan Configuration File**: The `morganConfig.ts` file configures Morgan to use the `combined` format and log messages using the Winston logger.
- **Express App**: The `morganMiddleware` is imported and used in the Express app for HTTP request logging.

This chapter builds on the Winston setup from the previous chapter, using Winston for log message handling.


---

This structure ensures that the Morgan configuration is separated into its own file, keeping the `index.ts` file clean and focused on setting up the Express app.

## Adding Reloading Capabilities

In this chapter, we’ll configure automatic reloading for both the server and client sides of your Express TypeScript application when they are running as separate applications in different environments. We’ll use `nodemon` for server-side reloading and `vite` for client-side reloading. We’ll also use `concurrently` to run both servers simultaneously.

## Key Considerations

1. **Separate Environments**: Ensure that your client and server applications can communicate over a network through API endpoints.
2. **CORS Configuration**: Your server should handle Cross-Origin Resource Sharing (CORS) requests.
3. **Proxy Configuration for Vite**: Configure Vite to proxy API requests to your Express server.


## Recommended Setup

Given your setup, where the client and server are running as separate applications, follow these steps:

### Vite on Client

- **Install and configure Vite for client-side development.**
- **Set up a proxy in `vite.config.ts`** to forward API requests to your Express server. This ensures that the Vite development server can communicate with your backend server.

### Nodemon on Server

- **Install and configure Nodemon** to automatically restart the Express server on code changes.
- **Configure Nodemon in the server’s `package.json`** to watch for changes in server-side files and restart the server as needed.


## 1 Install Dependencies

First, install the necessary packages for the server and client. On the server side, ensure you have these installed:

```bash
npm install --save-dev nodemon concurrently
```

On the client side, install Vite and React Refresh:

```bash
npm install --save-dev vite @vitejs/plugin-react-refresh
```

## 2 Configure CORS on the Server

Your Express server should be configured to handle CORS requests. This was covered in a previous chapter. Here’s a brief reminder:

### Update `index.ts` (or Equivalent)

Ensure that your server entry file includes the following:

```typescript
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // Allow all origins; adjust as needed for security

// Other middleware and routes

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## 3 Configure Vite Proxy for Client-Side Reloading

Configure Vite to forward API requests to your Express server.

### Update `vite.config.ts`

Create or update `vite.config.ts` in your client application’s root directory:

```typescript
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 3001,
    hmr: true,  // Enable Hot Module Replacement
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // The URL of your Express server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### Explanation

- **`proxy`**: Forwards requests from `/api` on the Vite client to `http://localhost:3000`, where your Express server is running.
- **`rewrite`**: Adjusts the path to remove the `/api` prefix before forwarding the request to the server.

## 4 Configure Concurrently to Run Both Servers

Ensure your `package.json` scripts are set up to run both the server and client development servers concurrently.

### Update `package.json` Scripts

Modify the `scripts` section of your server’s `package.json`:

```json
"scripts": {
  "start": "ts-node ./src/index.ts",
  "dev:server": "nodemon",
  "dev:client": "vite",
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
}
```

### Explanation

- **`dev:server`**: Runs the Express server with `nodemon`.
- **`dev:client`**: Runs the Vite development server for the client-side.
- **`dev`**: Runs both `dev:server` and `dev:client` concurrently using `concurrently`.

## 5 Running the Application

To start both the server and client in development mode, use the following command from the root of your project for both client app and server app:

```bash
npm run dev
```

### Explanation

- This command will start `nodemon` to watch for server-side changes and `vite` to serve and automatically reload client-side changes.

## 6 Summary

- **CORS Configuration**: Ensure your Express server allows requests from your client application.
- **Vite Proxy Configuration**: Set up Vite to proxy API requests to your Express server to facilitate communication.
- **Concurrent Running**: Use `concurrently` to run both the client and server development servers simultaneously.


## Code Standards

In this chapter, we'll focus on setting up code standards and formatting for your TypeScript and Express project using WebStorm. Consistent code formatting and adhering to best practices are essential for maintaining code quality and collaboration efficiency.

## Step 1: Set Up Prettier for Code Formatting

Prettier is a popular code formatter that helps maintain consistent code style across your project. Here's how to set it up:

### 1. Install Prettier

Run the following command to install Prettier and related plugins:

```bash
npm install eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-unused-imports --save-dev
```

### 2. Create ESLint Configuration File

Create an `.eslintrc.js` file in the root of your project with the following content:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Uses eslint-config-prettier to disable ESLint rules from conflicting with Prettier
  ],
  plugins: ['@typescript-eslint', 'prettier', 'unused-imports'],
  rules: {
    'prettier/prettier': 'error', // Runs Prettier as an ESLint rule and reports differences as individual ESLint issues
    'no-unused-vars': 'off', // Disable the base rule as it can report incorrect errors
    '@typescript-eslint/no-unused-vars': 'off', // Disable the TypeScript-specific rule as well
    'unused-imports/no-unused-imports': 'error', // Removes unused imports
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
```

### 3. Create Prettier Configuration File

Create a `.prettierrc` file in the root of your project to define your formatting rules. For example:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 4. Create a `.prettierignore` File

Add a `.prettierignore` file to exclude files and directories from being formatted by Prettier:

```plaintext
node_modules
dist
```

### 5. Create an ESLint Ignore File

Add a `.eslintignore` file to exclude files and directories from being linted by ESLint:

```plaintext
node_modules
dist
```

## Step 2: Integrate with WebStorm

### Using Built-In WebStorm Options

WebStorm has built-in support for both Prettier and ESLint. Here's how to set them up:

1. **Prettier**:
    1. Open WebStorm and go to **Preferences** (or **Settings**).
    2. Navigate to **Languages & Frameworks** > **Prettier**.
    3. Check the **On code reformat** and **On save** options to automatically format your code when saving files.
    4. Ensure the **Prettier package** field points to the `prettier` package installed in your project.

2. **ESLint**:
    1. Open WebStorm and go to **Preferences** (or **Settings**).
    2. Navigate to **Languages & Frameworks** > **JavaScript** > **Code Quality Tools** > **ESLint**.
    3. Select **Automatic ESLint Configuration** or specify the path to your `.eslintrc.js` file.

### Using Plugins

If you prefer to use plugins, install the following plugins in WebStorm:

1. **Prettier**:
    1. Go to **Preferences** (or **Settings**).
    2. Navigate to **Plugins**.
    3. Search for **Prettier** and install it.
    4. Configure Prettier as described above.

2. **ESLint**:
    1. Go to **Preferences** (or **Settings**).
    2. Navigate to **Plugins**.
    3. Search for **ESLint** and install it.
    4. Configure ESLint as described above.

## Step 3: Add Scripts for Formatting and Linting

Add the following scripts to your `package.json` to facilitate code formatting and linting:

```json
"scripts": {
  "format": "prettier --write \"src/**/*.{ts,tsx}\"",
  "lint": "eslint \"src/**/*.{ts,tsx}\" --fix"
}
```

You can now run `npm run format` to format your code and `npm run lint` to lint your code.

## Summary

In this chapter, we set up code standards for your TypeScript and Express project using Prettier for code formatting and ESLint for linting. We configured WebStorm to integrate with these tools and added scripts to automate code formatting and linting tasks.

## Basic Unit Test Setup for Service Logic

1. **Install Testing Dependencies**:

   ```bash
   npm install --save-dev jest ts-jest @types/jest
   ```

2. **Jest Configuration**:

   ```js
   // jest.config.js
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     setupFilesAfterEnv: ['./test/setup.ts'],
   };
   ```

3. **Example Unit Test for PostgreSQL**:

   ```typescript
   // test/unit/moviePgService.test.ts
   import { MoviePgService } from '../../src/services/moviePgService';
   import pool from '../../src/config/inMemoryPostgres';

   const moviePgService = new MoviePgService();

   test('should create and fetch movies', async () => {
     await moviePgService.createMovie('Test Movie', 'Test Content');
     const movies = await moviePgService.getAllMovies();
     expect(movies.length).toBe(1);
     expect(movies[0].title).toBe('Test Movie');
   });
   ```

4. **Example Unit Test for MongoDB**:

   ```typescript
   // test/unit/movieMongoService.test.ts
   import { MovieMongoService } from '../../src/services/movieMongoService';
   import { client } from '../../src/config/inMemoryMongo';

   const movieMongoService = new MovieMongoService();

   test('should create and fetch movies', async () => {
     await movieMongoService.createMovie('Test Movie', 'Test Content');
     const movies = await movieMongoService.getAllMovies();
     expect(movies.length).toBe(1);
     expect(movies[0].title).toBe('Test Movie');
   });
   ```

5. **Example Unit Test for Redis**:

   ```typescript
   // test/unit/movieRedisService.test.ts
   import { MovieRedisService } from '../../src/services/movieRedisService';
   import redis from '../../src/config/inMemoryRedis';

   const movieRedisService = new MovieRedisService();

   test('should create and fetch movies', async () => {
     await movieRedisService.createMovie('1', 'Test Movie', 'Test Content');
     const movies = await movieRedisService.getAllMovies();
     expect(movies.length).toBe(1);
     expect(movies[0].title).toBe('Test Movie');
   });
   ```



</details>


<details>
  <summary><strong>Setting Up Backend Structure (MVC) for PostgreSQL Database (click to expand) </strong></summary>

  ## Navigation

  - [1. Installing Required Packages](#1-installing-required-packages)
  - [2. Setting Up `pg-mem` for Unit and Integration Testing](#2-setting-up-pg-mem-for-unit-and-integration-testing)
  - [3. Basic PostgreSQL Configuration](#3-basic-postgresql-configuration)
  - [4. Basic Route Creation](#4-basic-route-creation)
  - [5. Setting Configuration for TypeORM](#5-setting-configuration-for-typeorm)
  - [6. Making an MVC Structure](#6-making-an-mvc-structure)


## 1. Installing Required Packages

### 1. Installing Required Packages

To set up a backend structure using PostgreSQL in a Node.js project, you need to install several essential packages. These packages will help you interact with the PostgreSQL database, set up in-memory databases for testing, and ensure proper TypeScript support.

#### Step 1: Initialize a New Node.js Project
If you haven't already, start by initializing a new Node.js project.

```bash
npm init -y
```

This command will create a `package.json` file in your project directory.

#### Step 2: Install Required Packages
Run the following command to install the necessary packages:

```bash
npm install pg pg-mem @types/pg
```

Here's a brief overview of what each package does:

- **pg**: This is the official PostgreSQL client for Node.js. It allows you to connect to and interact with a PostgreSQL database.
- **pg-mem**: This package provides an in-memory PostgreSQL instance, which is extremely useful for running unit and integration tests without needing an actual database instance.
- **@types/pg**: This package provides TypeScript type definitions for the `pg` library, ensuring proper type-checking and IntelliSense in your TypeScript project.


---



## 2. Setting Up `pg-mem` for Unit and Integration Testing

### 2. Setting Up `pg-mem` for Unit and Integration Testing

In this step, we will set up `pg-mem` to create an in-memory PostgreSQL instance for running unit and integration tests. This allows you to test your database interactions without requiring a live PostgreSQL server.

#### Step 1: Import Required Modules
First, create a new file in your `src` directory named `testDb.ts` (or a similar name). Import the necessary modules:

```typescript
import { newDb } from 'pg-mem';
import { Pool } from 'pg';
```

- **newDb**: A function provided by `pg-mem` to create a new in-memory database.
- **Pool**: The PostgreSQL connection pool provided by the `pg` library, which manages connections to the database.

#### Step 2: Set Up the Mock Database
### 2. Setting Up `pg-mem` for Unit and Integration Testing (Updated for Jest)

In this section, you'll learn how to set up `pg-mem` for testing with Jest, a popular testing framework for JavaScript and TypeScript.

#### Step 1: Import Required Modules
Create a new file in your `src` directory named `testDb.ts` (or a similar name). Import the necessary modules:

```typescript
import { newDb } from 'pg-mem';
import { Pool } from 'pg';
```

- **newDb**: A function provided by `pg-mem` to create a new in-memory database.
- **Pool**: The PostgreSQL connection pool provided by the `pg` library, which manages connections to the database.

#### Step 2: Set Up the Mock Database
We'll create a function to set up the mock database using `pg-mem`:

```typescript
const pgMem = newDb();

export const setupMockDb = async () => {
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        user: 'user',
        password: 'password',
    });

    const client = await pool.connect();
    pgMem.adapters.createPg().Client(client);

    return pool;
};
```

- **pgMem**: This is your in-memory PostgreSQL instance.
- **setupMockDb**: This function sets up the connection between the in-memory database and a PostgreSQL `Pool`.

#### Step 3: Example Test for a Transactional Method
Let's write a schematic example to test a transactional method using the mock database.

1. **Create a Sample Repository:**

   In `src/repositories/movieRepository.ts`, create a repository with a method that performs a transaction:

   ```typescript
   import { Pool } from 'pg';
   
   export class MovieRepository {
       constructor(private pool: Pool) {}

       async addMovie(id: number, name: string, isFavorite: boolean): Promise<void> {
           const client = await this.pool.connect();
           try {
               await client.query('BEGIN');
               await client.query(
                   'INSERT INTO movies (id, name, is_favorite) VALUES ($1, $2, $3)',
                   [id, name, isFavorite]
               );
               await client.query('COMMIT');
           } catch (error) {
               await client.query('ROLLBACK');
               throw error;
           } finally {
               client.release();
           }
       }
   }
   ```

   This repository method begins a transaction, inserts a movie into the database, and then commits the transaction. If any error occurs, it rolls back the transaction.

2. **Write a Test Case Using Jest:**

   Create a test case to ensure that this transaction works as expected. Place this test in `src/repositories/movieRepository.test.ts`:

   ```typescript
   import { setupMockDb } from '../testDb';
   import { MovieRepository } from './movieRepository';
   import { Pool } from 'pg';
   
   describe('MovieRepository', () => {
       let pool: Pool;
       let movieRepository: MovieRepository;
   
       beforeAll(async () => {
           pool = await setupMockDb();
           movieRepository = new MovieRepository(pool);
           await pool.query(`
               CREATE TABLE movies (
                   id INT PRIMARY KEY,
                   name TEXT NOT NULL,
                   is_favorite BOOLEAN NOT NULL
               )
           `);
       });
   
       afterAll(async () => {
           await pool.end();
       });

       it('should add a movie successfully', async () => {
           await movieRepository.addMovie(1, 'Inception', true);
   
           const result = await pool.query('SELECT * FROM movies WHERE id = $1', [1]);
           expect(result.rows.length).toBe(1);
           expect(result.rows[0].name).toBe('Inception');
           expect(result.rows[0].is_favorite).toBe(true);
       });
   });
   ```

   - **beforeAll**: Initializes the mock database and repository before running any tests. It also creates the `movies` table.
   - **afterAll**: Closes the database connection after all tests have run.
   - **it**: Tests the `addMovie` method to ensure that it correctly inserts a movie into the database.

#### Step 4: Run the Tests with Jest
Finally, run your tests to ensure everything works correctly. If you have Jest installed, you can run:

```bash
npx jest
```

Jest will automatically find and run all test files in your project that match the pattern `*.test.ts`.

---

## 3. Basic PostgreSQL Configuration

### 3. Basic PostgreSQL Configuration

In this step, we'll configure the connection to a PostgreSQL database using the `pg` package. This configuration will allow your application to connect to the PostgreSQL database and perform various operations such as querying, inserting, updating, and deleting data.

#### Step 1: Create a Database Configuration File

Create a new directory named `config` inside your `src` directory. Inside `config`, create a file named `db.ts` to hold your database configuration:

```typescript
// src/config/db.ts
import { Pool } from 'pg';

// Create a new Pool instance with PostgreSQL connection details
const pool = new Pool({
    host: 'localhost',  // The hostname of the PostgreSQL server
    port: 5432,         // The port on which PostgreSQL is listening (default is 5432)
    database: 'mydb',   // The name of the database you want to connect to
    user: 'user',       // The username for connecting to the database
    password: 'password' // The password for the specified user
});

// Export the Pool instance to use it in other parts of your application
export default pool;
```

- **host**: The hostname where your PostgreSQL server is running, typically `localhost` if running locally.
- **port**: The port number for the PostgreSQL server. The default is `5432`.
- **database**: The name of the database you want to connect to.
- **user**: The username for authenticating with the PostgreSQL server.
- **password**: The password associated with the specified user.

#### Step 2: Use the Database Configuration in Your Application

To use this configuration in other parts of your application, simply import the `pool` object wherever you need to interact with the database.

For example, in a repository or service:

```typescript
// src/repositories/movieRepository.ts
import pool from '../config/db';

export class MovieRepository {
    async getMovies(): Promise<any[]> {
        const result = await pool.query('SELECT * FROM movies');
        return result.rows;
    }

    // Other methods interacting with the database
}
```

Here, the `pool.query` method is used to execute SQL queries against the database. The `getMovies` method retrieves all records from the `movies` table.

#### Step 3: Test the Configuration

To ensure your configuration is working correctly, you can create a simple script to connect to the database and perform a basic query.

Create a file `src/testDbConnection.ts`:

```typescript
import pool from './config/db';

(async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connected:', result.rows[0]);
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        pool.end();
    }
})();
```

Run this script using `ts-node` to test the connection:

```bash
npx ts-node src/testDbConnection.ts
```

If your configuration is correct, you should see a message in the console indicating that the database is connected, along with the current timestamp.

---

## 4. Basic Route Creation

### 4. Basic Route Creation

In this step, we’ll create basic routes for handling HTTP requests using Express.js. We’ll cover how to set up `GET`, `POST`, and parameterized routes, as well as how to handle query parameters.

#### Step 1: Setting Up Express

If you haven’t already installed Express, do so by running:

```bash
npm install express @types/express
```

- **express**: A fast, unopinionated, minimalist web framework for Node.js.
- **@types/express**: TypeScript type definitions for Express.

#### Step 2: Creating a Basic Express Server

Create a new file named `server.ts` in your `src` directory:

```typescript
import express, { Application } from 'express';
import moviesRouter from './routes/moviesRouter';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use('/movies', moviesRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
```

This basic Express server listens on port `3000` and uses `moviesRouter` for handling routes under `/movies`.

#### Step 3: Creating the Movies Router

Create a new directory named `routes` inside your `src` directory. Inside `routes`, create a file named `moviesRouter.ts`:

```typescript
import express, { Request, Response, NextFunction } from 'express';

const moviesRouter = express.Router();

// Example: GET Route
moviesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            res.status(400).send('Query parameter "q" is required');
            return;
        }

        // Simulate fetching movies based on the query
        const movies = [{ id: 1, name: `Movie matching ${query}` }]; // Mock data

        res.json(movies);
    } catch (e) {
        next(e);
    }
});

// Example: POST Route
moviesRouter.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            res.status(400).send('ID and Name are required');
            return;
        }

        // Simulate adding a movie
        res.status(201).json({ message: 'Movie added successfully', movie: { id, name } });
    } catch (e) {
        next(e);
    }
});

// Example: Route with Parameter
moviesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Simulate fetching a movie by ID
        const movie = { id, name: 'Sample Movie' }; // Mock data

        res.json(movie);
    } catch (e) {
        next(e);
    }
});

export default moviesRouter;
```

- **GET Route**: Handles requests to `/movies` and optionally accepts a query parameter `q`. If `q` is provided, it returns a list of movies matching the query.
- **POST Route**: Handles requests to `/movies/add`. It expects a movie object in the request body and simulates adding it to a database.
- **Parameterized Route**: Handles requests to `/movies/:id`, where `:id` is a dynamic parameter representing a movie’s ID.

#### Step 4: Testing the Routes

Start the Express server by running:

```bash
npx ts-node src/server.ts
```

Use a tool like Postman or cURL to test the routes:

- **GET `/movies?q=somequery`**: Should return a list of movies matching the query.
- **POST `/movies/add`**: Should add a new movie when provided with an ID and name in the request body.
- **GET `/movies/1`**: Should return a movie with the ID `1`.

#### Step 5: Example Client-Side Integration

For the POST route `/movies/add`, here’s how you might integrate it on the client side:

```typescript
const handleAddFavoriteMovie = async (movie: { id: number; name: string }) => {
    const response = await fetch(`http://localhost:3000/movies/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    });

    if (response.ok) {
        console.log('Movie added successfully!');
    } else {
        console.error('Failed to add movie.');
    }
};
```

This function sends a `POST` request to the `/movies/add` endpoint to add a new movie.

---

## 5. Setting Configuration for TypeORM

### 5. Setting Up TypeORM Configuration

In this step, we'll configure TypeORM, an ORM (Object-Relational Mapper) for TypeScript and JavaScript, to work with PostgreSQL. This setup will include defining a basic configuration, creating entities, and setting up DTOs (Data Transfer Objects) for type validation.

#### Step 1: Install TypeORM and Required Packages

First, install TypeORM along with the PostgreSQL driver:

```bash
npm install typeorm reflect-metadata pg
```

- **typeorm**: The ORM library for TypeScript and JavaScript.
- **reflect-metadata**: A dependency required by TypeORM for its decorators.
- **pg**: The PostgreSQL client library, which TypeORM uses to connect to PostgreSQL.

#### Step 2: Create TypeORM Configuration

Create a new file named `ormconfig.ts` in the root of your project directory:

```typescript
import { DataSource } from 'typeorm';
import { Movie } from './src/entities/Movie';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'mydb',
    entities: [Movie],
    synchronize: true, // Automatically create database tables
    logging: true, // Optional: Log SQL queries for debugging
});

export default AppDataSource;
```

In this configuration:

- **type**: Specifies the database type (PostgreSQL in this case).
- **host, port, username, password, database**: Connection details for your PostgreSQL database.
- **entities**: An array of entities that TypeORM will manage.
- **synchronize**: Automatically synchronize the database schema with your entity definitions. Set this to `false` in production.

#### Step 3: Define a Basic Entity

Create a new directory named `entities` inside your `src` directory. Inside `entities`, create a file named `Movie.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isFavorite: boolean;
}
```

In this entity definition:

- **@Entity**: Decorator that marks this class as an entity to be managed by TypeORM.
- **@PrimaryGeneratedColumn**: Decorator that marks the `id` property as the primary key and auto-generates it.
- **@Column**: Decorator that marks the properties as columns in the database.

#### Step 4: Define a DTO for Data Validation

Create a new directory named `dto` inside your `src` directory. Inside `dto`, create a file named `MovieDto.ts`:

```typescript
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MovieDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    isFavorite: boolean;

    constructor(id: number, name: string, isFavorite: boolean) {
        this.id = id;
        this.name = name;
        this.isFavorite = isFavorite;
    }
}
```

In this DTO:

- **@IsNotEmpty**: Ensures that the field is not empty.
- **@IsNumber, @IsString, @IsBoolean**: Validates the type of the field.

#### Step 5: Integrate TypeORM into Your Application

Modify your `server.ts` file to initialize TypeORM and use it in your application:

```typescript
import 'reflect-metadata';
import express, { Application } from 'express';
import AppDataSource from './ormconfig';
import moviesRouter from './routes/moviesRouter';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use('/movies', moviesRouter);

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error during Data Source initialization', error);
    });
```

Here, **AppDataSource.initialize()** initializes the TypeORM data source before starting the Express server.

---

## 6. Making an MVC Structure


### 6. Making an MVC Structure

In this step, we'll set up a basic MVC (Model-View-Controller) structure for your application using TypeORM with PostgreSQL. This includes creating a repository layer for database operations, a service layer for business logic, and a controller layer for handling HTTP requests. We’ll also show how to integrate these layers.

#### Step 1: Define the MVC Structure

Here’s how the MVC structure will be organized:

- **Models**: Define the structure of your data (e.g., TypeORM entities).
- **Views**: In a typical MVC application, views are the user interface components. In an API context, this layer is usually minimal or omitted since it primarily deals with JSON responses.
- **Controllers**: Handle HTTP requests and interact with services.
- **Services**: Contain business logic and interact with the repository layer.
- **Repositories**: Perform database operations using TypeORM.

#### Step 2: Create a Repository Layer

Create a `repositories` directory inside your `src` directory. Inside `repositories`, create a file named `MovieRepository.ts`:

```typescript
import { Repository, DataSource } from 'typeorm';
import { Movie } from '../entities/Movie';
import AppDataSource from '../ormconfig';

export class MovieRepository extends Repository<Movie> {
    constructor() {
        super(Movie, AppDataSource.manager);
    }

    async addMovie(movie: Movie): Promise<Movie> {
        return this.save(movie);
    }

    async getMovies(): Promise<Movie[]> {
        return this.find();
    }

    async getMovieById(id: number): Promise<Movie | null> {
        return this.findOneBy({ id });
    }

    async updateMovie(movie: Movie): Promise<Movie> {
        await this.save(movie);
        return movie;
    }

    async deleteMovie(id: number): Promise<void> {
        await this.delete(id);
    }
}
```

In this repository:

- **addMovie**: Adds a new movie to the database.
- **getMovies**: Retrieves all movies.
- **getMovieById**: Retrieves a movie by its ID.
- **updateMovie**: Updates an existing movie.
- **deleteMovie**: Deletes a movie by its ID.

#### Step 3: Create a Service Layer

Create a `services` directory inside your `src` directory. Inside `services`, create a file named `MovieService.ts`:

```typescript
import { MovieRepository } from '../repositories/MovieRepository';
import { Movie } from '../entities/Movie';
import { MovieDto } from '../dto/MovieDto';

export class MovieService {
    private movieRepository = new MovieRepository();

    async addMovie(dto: MovieDto): Promise<Movie> {
        const movie = new Movie();
        movie.id = dto.id;
        movie.name = dto.name;
        movie.isFavorite = dto.isFavorite;

        return this.movieRepository.addMovie(movie);
    }

    async getMovies(): Promise<Movie[]> {
        return this.movieRepository.getMovies();
    }

    async getMovieById(id: number): Promise<Movie | null> {
        return this.movieRepository.getMovieById(id);
    }

    async updateMovie(dto: MovieDto): Promise<Movie> {
        const movie = await this.movieRepository.getMovieById(dto.id);
        if (movie) {
            movie.name = dto.name;
            movie.isFavorite = dto.isFavorite;
            return this.movieRepository.updateMovie(movie);
        }
        throw new Error('Movie not found');
    }

    async deleteMovie(id: number): Promise<void> {
        await this.movieRepository.deleteMovie(id);
    }
}
```

In this service:

- **addMovie**: Converts a DTO to an entity and adds it to the database.
- **getMovies**: Retrieves all movies using the repository.
- **getMovieById**: Retrieves a specific movie by its ID.
- **updateMovie**: Updates an existing movie based on the DTO.
- **deleteMovie**: Deletes a movie by its ID.

#### Step 4: Create a Controller Layer

Update the `routes/moviesRouter.ts` file to use the service layer:

```typescript
import express, { Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/MovieService';
import { MovieDto } from '../dto/MovieDto';

const moviesRouter = express.Router();
const movieService = new MovieService();

// GET Route
moviesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await movieService.getMovies();
        res.json(movies);
    } catch (e) {
        next(e);
    }
});

// POST Route
moviesRouter.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = req.body as MovieDto;
        const movie = await movieService.addMovie(dto);
        res.status(201).json(movie);
    } catch (e) {
        next(e);
    }
});

// GET Route with Parameter
moviesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const movie = await movieService.getMovieById(id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (e) {
        next(e);
    }
});

// PUT Route
moviesRouter.put('/update', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = req.body as MovieDto;
        const movie = await movieService.updateMovie(dto);
        res.json(movie);
    } catch (e) {
        next(e);
    }
});

// DELETE Route
moviesRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await movieService.deleteMovie(id);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
});

export default moviesRouter;
```

- **GET `/`**: Retrieves all movies.
- **POST `/add`**: Adds a new movie.
- **GET `/:id`**: Retrieves a movie by ID.
- **PUT `/update`**: Updates an existing movie.
- **DELETE `/:id`**: Deletes a movie by ID.

#### Step 5: Testing the MVC Structure

Ensure that your application works correctly by running the server and testing the routes using a tool like Postman or cURL.

---


</details>

