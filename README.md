
# TypeScript Project Setup Tutorial


<details>
  <summary><strong>Basic Setup (click to expand)</strong></summary>

## Basic Setup Navigation
- [Setting Up the Project](#setting-up-the-project)
- [Adding Security Features](#adding-security-features)
- [Setting Up Logging with Winston](#setting-up-logging-with-winston)
- [Adding Monitoring Capabilities with Morgan](#adding-monitoring-capabilities-with-morgan)
- [Adding Reloading Capabilities](#adding-reloading-capabilities)
- [Code Standards](#code-standards)
- [Basic Unit Test Setup for Service Logic](#basic-unit-test-setup-for-service-logic)

## Setting Up the Project

In this chapter, we'll start by setting up a basic Express TypeScript project. This will include installing necessary dependencies and setting up TypeScript.

### 1 Initialize the Project

First, create a new directory for your project and navigate into it:

```bash
mkdir express-typescript-app
cd express-typescript-app
```

Initialize a new Node.js project:

```bash
npm init -y
```

### 2 Install Dependencies

Install Express and TypeScript along with the necessary types and development tools:

```bash
npm install express
npm install typescript @types/express ts-node --save-dev
```

### 3 Set Up TypeScript Configuration

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

### 4 Create Basic Project Structure

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

### 5 Create the Main Entry Point

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

### 6 Add Build and Start Scripts

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

[Return to Basic Setup Navigation](#basic-setup-navigation)

## Adding Security Features

In this chapter, we'll add some basic security features to our Express TypeScript application. This includes setting HTTP headers, enabling CORS, and using environment variables for configuration.

### 1 Install Security Dependencies

First, install some commonly used security middleware:

```bash
npm install helmet cors dotenv
npm install @types/cors @types/dotenv --save-dev
```

### 2 Configure Environment Variables

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

### 3 Set Up Helmet and CORS Middleware

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

#### Explanation

- **Helmet**: Helmet helps secure your Express apps by setting various HTTP headers. It includes a collection of smaller middleware functions that set security-related HTTP headers.
- **CORS**: Cross-Origin Resource Sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain. The `cors` package provides a middleware to enable CORS with various options.

### 4 Using Environment Variables

We've already set up the `dotenv` package to load environment variables from a `.env` file. Using environment variables helps keep sensitive information like configuration settings out of your source code.

You can now access these variables using `process.env`.

#### Example: Using Environment Variables

In your `src/index.ts`, you can access the `PORT` environment variable like this:

```typescript
const port = process.env.PORT || 3000;
```

This completes the setup for adding basic security features to our Express TypeScript application.

[Return to Basic Setup Navigation](#basic-setup-navigation)

## Setting Up Logging with Winston

In this chapter, we'll add logging capabilities to our Express TypeScript application using `winston` for more advanced logging features.

### 1 Install Winston

First, install `winston`:

```bash
npm install winston
npm install @types/winston --save-dev
```

### 2 Create a Logger Configuration File

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

#### Explanation

- **createLogger**: Creates a new logger instance.
- **level**: Sets the logging level. The logger will only log messages at this level or higher.
- **format**: Defines the format for log messages. Here, it's combining a timestamp and a custom printf format.
- **transports**: Defines where to log messages. In this case, to the console and to files (one for errors and one for all logs).

### 3 Logger Levels in Winston

Winston has several logging levels, each with a specific priority. The levels are:

- **error**: Priority 0, for logging error messages.
- **warn**: Priority 1, for logging warning messages.
- **info**: Priority 2, for logging informational messages.
- **http**: Priority 3, for logging HTTP requests (not used by default).
- **verbose**: Priority 4, for logging verbose messages.
- **debug**: Priority 5, for logging debug messages.
- **silly**: Priority 6, for logging everything, including silly messages.

You can set the logging level when creating the logger, and it will log messages at that level and above. For example, if the level is set to `info`, it will log `info`, `warn`, and `error` messages, but not `debug` or `silly` messages.

#### Example Usage

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

[Return to Basic Setup Navigation](#basic-setup-navigation)

## Adding Monitoring Capabilities with Morgan

In this chapter, we'll add monitoring capabilities to our Express TypeScript application using `morgan` for HTTP request logging.

### 1 Install Monitoring Dependencies

First, install `morgan` for HTTP request logging:

```bash
npm install morgan
npm install @types/morgan --save-dev
```

### 2 Create a Morgan Configuration File

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

### 3 Set Up Morgan in the Express App

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

#### Explanation

- **Morgan Configuration File**: The `morganConfig.ts` file configures Morgan to use the `combined` format and log messages using the Winston logger.
- **Express App**: The `morganMiddleware` is imported and used in the Express app for HTTP request logging.

This chapter builds on the Winston setup from the previous chapter, using Winston for log message handling.


---

This structure ensures that the Morgan configuration is separated into its own file, keeping the `index.ts` file clean and focused on setting up the Express app.

[Return to Basic Setup Navigation](#basic-setup-navigation)


## Adding Reloading Capabilities

In this chapter, we’ll configure automatic reloading for both the server and client sides of your Express TypeScript application when they are running as separate applications in different environments. We’ll use `nodemon` for server-side reloading and `vite` for client-side reloading. We’ll also use `concurrently` to run both servers simultaneously.

### Key Considerations

1. **Separate Environments**: Ensure that your client and server applications can communicate over a network through API endpoints.
2. **CORS Configuration**: Your server should handle Cross-Origin Resource Sharing (CORS) requests.
3. **Proxy Configuration for Vite**: Configure Vite to proxy API requests to your Express server.


### Recommended Setup

Given the setup, where the client and server are running as separate applications, follow these steps:

#### Vite on Client

- **Install and configure Vite for client-side development.**
- **Set up a proxy in `vite.config.ts`** to forward API requests to your Express server. This ensures that the Vite development server can communicate with your backend server.

#### Nodemon on Server

- **Install and configure Nodemon** to automatically restart the Express server on code changes.
- **Configure Nodemon in the server’s `package.json`** to watch for changes in server-side files and restart the server as needed.


### 1 Install Dependencies

First, install the necessary packages for the server and client. On the server side, ensure you have these installed:

```bash
npm install --save-dev nodemon concurrently
```

On the client side, install Vite and React Refresh:

```bash
npm install --save-dev vite @vitejs/plugin-react-refresh
```

### 2 Configure CORS on the Server

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

#### Update `vite.config.ts`

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

#### Explanation

- **`proxy`**: Forwards requests from `/api` on the Vite client to `http://localhost:3000`, where your Express server is running.
- **`rewrite`**: Adjusts the path to remove the `/api` prefix before forwarding the request to the server.

### 4 Configure Concurrently to Run Both Servers

Ensure your `package.json` scripts are set up to run both the server and client development servers concurrently.

#### Update `package.json` Scripts

Modify the `scripts` section of your server’s `package.json`:

```json
"scripts": {
  "start": "ts-node ./src/index.ts",
  "dev:server": "nodemon",
  "dev:client": "vite",
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
}
```

#### Explanation

- **`dev:server`**: Runs the Express server with `nodemon`.
- **`dev:client`**: Runs the Vite development server for the client-side.
- **`dev`**: Runs both `dev:server` and `dev:client` concurrently using `concurrently`.

### 5 Running the Application

To start both the server and client in development mode, use the following command from the root of your project for both client app and server app:

```bash
npm run dev
```

#### Explanation

- This command will start `nodemon` to watch for server-side changes and `vite` to serve and automatically reload client-side changes.

### 6 Summary

- **CORS Configuration**: Ensure your Express server allows requests from your client application.
- **Vite Proxy Configuration**: Set up Vite to proxy API requests to your Express server to facilitate communication.
- **Concurrent Running**: Use `concurrently` to run both the client and server development servers simultaneously.

[Return to Basic Setup Navigation](#basic-setup-navigation)

## Code Standards

In this chapter, we'll focus on setting up code standards and formatting for your TypeScript and Express project using WebStorm. Consistent code formatting and adhering to best practices are essential for maintaining code quality and collaboration efficiency.

### Step 1: Set Up Prettier for Code Formatting

Prettier is a popular code formatter that helps maintain consistent code style across your project. Here's how to set it up:

#### 1. Install Prettier

Run the following command to install Prettier and related plugins:

```bash
npm install eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-unused-imports --save-dev
```

#### 2. Create ESLint Configuration File

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

#### 3. Create Prettier Configuration File

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

#### 4. Create a `.prettierignore` File

Add a `.prettierignore` file to exclude files and directories from being formatted by Prettier:

```plaintext
node_modules
dist
```

#### 5. Create an ESLint Ignore File

Add a `.eslintignore` file to exclude files and directories from being linted by ESLint:

```plaintext
node_modules
dist
```

### Step 2: Integrate with WebStorm

#### Using Built-In WebStorm Options

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

#### Using Plugins

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

### Step 3: Add Scripts for Formatting and Linting

Add the following scripts to your `package.json` to facilitate code formatting and linting:

```json
"scripts": {
  "format": "prettier --write \"src/**/*.{ts,tsx}\"",
  "lint": "eslint \"src/**/*.{ts,tsx}\" --fix"
}
```

You can now run `npm run format` to format your code and `npm run lint` to lint your code.

### Summary

In this chapter, we set up code standards for your TypeScript and Express project using Prettier for code formatting and ESLint for linting. We configured WebStorm to integrate with these tools and added scripts to automate code formatting and linting tasks.

[Return to Basic Setup Navigation](#basic-setup-navigation)


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

[Return to Basic Setup Navigation](#basic-setup-navigation)

</details>


<details>
  <summary><strong>Setting Up Backend Structure (MVC) for PostgreSQL Database (click to expand) </strong></summary>

  ## PostgreSQL Setup Navigation 

  - [1. Installing Required Packages](#1-installing-required-packages)
  - [2. Setting Up `pg-mem` for Unit and Integration Testing](#2-setting-up-pg-mem-for-unit-and-integration-testing)
  - [3. Basic PostgreSQL Configuration](#3-basic-postgresql-configuration)
  - [4. Basic Route Creation](#4-basic-route-creation)
  - [5. Setting Configuration for TypeORM](#5-setting-configuration-for-typeorm)
  - [6. Making an MVC Structure](#6-making-an-mvc-structure)


## 1. Installing Required Packages

To set up a backend structure using PostgreSQL in a Node.js project, you need to install several essential packages. These packages will help you interact with the PostgreSQL database, set up in-memory databases for testing, and ensure proper TypeScript support.

### Step 1: Initialize a New Node.js Project
If you haven't already, start by initializing a new Node.js project.

```bash
npm init -y
```

This command will create a `package.json` file in your project directory.

### Step 2: Install Required Packages
Run the following command to install the necessary packages:

```bash
npm install pg pg-mem @types/pg
```

Here's a brief overview of what each package does:

- **pg**: This is the official PostgreSQL client for Node.js. It allows you to connect to and interact with a PostgreSQL database.
- **pg-mem**: This package provides an in-memory PostgreSQL instance, which is extremely useful for running unit and integration tests without needing an actual database instance.
- **@types/pg**: This package provides TypeScript type definitions for the `pg` library, ensuring proper type-checking and IntelliSense in your TypeScript project.


---

[Back To PostgreSQL Setup Navigation](#postgresql-setup-navigation)


## 2. Setting Up `pg-mem` for Unit and Integration Testing

In this section, you'll learn how to set up `pg-mem` for testing with Jest, a popular testing framework for JavaScript and TypeScript.

### Step 1: Import Required Modules
Create a new file in your `src` directory named `testDb.ts` (or a similar name). Import the necessary modules:

```typescript
import { newDb } from 'pg-mem';
import { Pool } from 'pg';
```

- **newDb**: A function provided by `pg-mem` to create a new in-memory database.
- **Pool**: The PostgreSQL connection pool provided by the `pg` library, which manages connections to the database.

### Step 2: Set Up the Mock Database
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

### Step 3: Example Test for a Transactional Method
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

### Step 4: Run the Tests with Jest
Finally, run your tests to ensure everything works correctly. If you have Jest installed, you can run:

```bash
npx jest
```

Jest will automatically find and run all test files in your project that match the pattern `*.test.ts`.

---

[Back To PostgreSQL Setup Navigation](#postgresql-setup-navigation)

## 3. Basic PostgreSQL Configuration

In this step, we'll configure the connection to a PostgreSQL database using the `pg` package. This configuration will allow your application to connect to the PostgreSQL database and perform various operations such as querying, inserting, updating, and deleting data.

### Step 1: Create a Database Configuration File

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

### Step 2: Use the Database Configuration in Your Application

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

### Step 3: Test the Configuration

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

[Back To PostgreSQL Setup Navigation](#postgresql-setup-navigation)

## 4. Basic Route Creation

In this step, we’ll create basic routes for handling HTTP requests using Express.js. We’ll cover how to set up `GET`, `POST`, and parameterized routes, as well as how to handle query parameters.


### Step 1: Creating the Movies Router

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


### Step 2: Example Client-Side Integration

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

[Back To PostgreSQL Setup Navigation](#postgresql-setup-navigation)

## 5. Setting Configuration for TypeORM


In this step, we'll configure TypeORM for PostgreSQL, define entities, and demonstrate how to create relationships between entities using TypeORM decorators. This setup will include defining a basic configuration, creating entities with one-to-one, many-to-one, and many-to-many relationships, and setting up DTOs (Data Transfer Objects) for type validation.

### Step 1: Install TypeORM and Required Packages

First, install TypeORM along with the PostgreSQL driver:

```bash
npm install typeorm reflect-metadata
```

- **typeorm**: The ORM library for TypeScript and JavaScript.
- **reflect-metadata**: A dependency required by TypeORM for its decorators.

### Step 2: Create TypeORM Configuration

Create a new file named `ormconfig.ts` in the root of your project directory:

```typescript
import { DataSource } from 'typeorm';
import { User } from './src/entities/User';
import { UserProfile } from './src/entities/UserProfile';
import { Movie } from './src/entities/Movie';
import { Genre } from './src/entities/Genre';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'mydb',
    entities: [User, UserProfile, Movie, Genre],
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

### Step 3: Define Entities with Relationships

We will define several entities: `User`, `UserProfile`, `Movie`, and `Genre`. These entities will have various relationships such as one-to-one, many-to-one, and one-to-many.

#### User and UserProfile (One-to-One Relationship)

Create a `User.ts` file inside the `entities` directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserProfile } from './UserProfile';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => UserProfile, profile => profile.user)
    @JoinColumn()
    profile: UserProfile;
}
```

Create a `UserProfile.ts` file inside the `entities` directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    bio: string;

    @OneToOne(() => User, user => user.profile)
    user: User;
}
```

- **One-to-One**: A user has one profile, and each profile belongs to one user.
- **@OneToOne**: Defines the one-to-one relationship.
- **@JoinColumn**: Specifies the owning side of the relationship.

#### Movie and Genre (Many-to-One and One-to-Many Relationship)

Create a `Movie.ts` file inside the `entities` directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Genre } from './Genre';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Genre, genre => genre.movies)
    genre: Genre;
}
```

Create a `Genre.ts` file inside the `entities` directory:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movie } from './Movie';

@Entity()
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Movie, movie => movie.genre)
    movies: Movie[];
}
```

- **Many-to-One**: Each movie belongs to a single genre.
- **One-to-Many**: A genre can have many movies.
- **@ManyToOne**: Defines the many-to-one relationship.
- **@OneToMany**: Defines the one-to-many relationship.

### Step 4: Define a DTO for Data Validation

Create a new directory named `dto` inside your `src` directory. Inside `dto`, create a file named `MovieDto.ts`:

```typescript
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MovieDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    genreId: number;

    @IsNotEmpty()
    @IsBoolean()
    isFavorite: boolean;

    constructor(id: number, title: string, genreId: number, isFavorite: boolean) {
        this.id = id;
        this.title = title;
        this.genreId = genreId;
        this.isFavorite = isFavorite;
    }
}
```

In this DTO:

- **@IsNotEmpty**: Ensures that the field is not empty.
- **@IsNumber, @IsString, @IsBoolean**: Validates the type of the field.

### Step 5: Integrate TypeORM into Your Application

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


[Back To PostgreSQL Setup Navigation](#postgresql-setup-navigation)


## 6. Making an MVC Structure

In this chapter, we'll establish the Model-View-Controller (MVC) structure for your application, focusing on the repository, service, and controller layers. Each layer has its responsibilities, and together they form the backbone of your application.

### Step 1: Repository Layer

The repository layer interacts directly with the database, providing methods to retrieve, insert, update, and delete data. Here are examples of different approaches to querying the database using TypeORM's QueryBuilder, raw SQL, and manual database management with `pool.query`.



#### Explanation

- **`Repository` Class**: 
  The `Repository` class in TypeORM is a generic class that provides methods for managing database entities. It handles common operations like finding, saving, updating, and deleting records. Each entity in your application typically has its own repository, which allows you to interact with that entity's records in the database.

  For example, if you have an entity called `Movie`, the corresponding repository (`MovieRepository`) would allow you to perform CRUD (Create, Read, Update, Delete) operations on `Movie` records.


#### 1. Example with QueryBuilder and Extending TypeORM's `Repository` Class

```typescript
import { Repository } from 'typeorm';
import { Movie } from '../entities/Movie';

export class MovieRepository extends Repository<Movie> {
    async getTopRatedMovies(year: number): Promise<Movie[]> {
        return await this.createQueryBuilder('movie')
            .where('movie.rating > :rating', { rating: 8 })
            .andWhere('movie.releaseYear = :year', { year })
            .orderBy('movie.title', 'ASC')
            .getMany();
    }
}
```

- **Explanation**: In this example, the `MovieRepository` class extends the `Repository` class, inheriting all its methods, and adds a custom method `getTopRatedMovies` that uses the `QueryBuilder` to construct a complex SQL query. The `QueryBuilder` allows for flexible and powerful query construction, especially useful for complex conditions or joins.

#### 2. Example Using TypeORM's Built-in Repository Methods Without QueryBuilder

```typescript
import { Repository } from 'typeorm';
import { Movie } from '../entities/Movie';

export class MovieRepository extends Repository<Movie> {
    async getTopRatedMovies(year: number): Promise<Movie[]> {
        return await this.find({
            where: {
                rating: MoreThan(8),
                releaseYear: year
            },
            order: {
                title: 'ASC'
            }
        });
    }
}
```

- **Explanation**: In this example, the `MovieRepository` class uses TypeORM’s built-in `find` method instead of `QueryBuilder`. The `find` method is simpler and more concise, utilizing TypeORM's query helpers like `MoreThan` to filter results. This approach is more declarative and is often preferred for straightforward queries. 

These examples demonstrate how you can leverage both the `Repository` class’s built-in methods and the `QueryBuilder` for different querying needs, all within the context of a custom repository created with the `EntityRepository` decorator.

##### 2. Using Raw SQL with TypeORM

You can execute raw SQL queries if you need more control over the query structure.

```typescript
import { AppDataSource } from '../ormconfig';

export class MovieRepository {
    async getMoviesWithRawSQL(rating: number, year: number): Promise<any[]> {
        return await AppDataSource.query(
            `SELECT * FROM movie WHERE rating > $1 AND release_year = $2 ORDER BY title ASC`,
            [rating, year]
        );
    }
}
```

This approach allows you to run custom SQL queries while still benefiting from TypeORM's connection management.

##### 3. Using `pool.query` in Non-TypeORM Code

Sometimes, you may want to manage the database connection directly, using `pool.query`.

```typescript
import { Pool } from 'pg';

const pool = new Pool({
    user: 'your-username',
    host: 'localhost',
    database: 'your-database',
    password: 'your-password',
    port: 5432,
});

export class MovieRepository {
    async getMoviesDirectly(rating: number): Promise<any[]> {
        const res = await pool.query('SELECT * FROM movie WHERE rating > $1', [rating]);
        return res.rows;
    }
}
```

This method is typically used in projects that don't use an ORM or where more control over database interactions is needed.

##### Repository Layer Request Examples

1. **Getting All Movies:**

```typescript
async getAllMovies(): Promise<Movie[]> {
    return await AppDataSource.getRepository(Movie).find();
}
```

2. **Getting a Movie by ID:**

```typescript
async getMovieById(id: number): Promise<Movie | null> {
    return await AppDataSource.getRepository(Movie).findOneBy({ id });
}
```

3. **Getting Movies by Genre:**

```typescript
async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    return await AppDataSource.getRepository(Movie).findBy({ genre: { id: genreId } });
}
```

4. **Getting Movies by Multiple Parameters:**

```typescript
async getMoviesByCriteria(rating: number, year: number): Promise<Movie[]> {
    return await AppDataSource.getRepository(Movie)
        .createQueryBuilder('movie')
        .where('movie.rating > :rating', { rating })
        .andWhere('movie.releaseYear = :year', { year })
        .getMany();
}
```

5. **Adding a Movie:**

```typescript
async addMovie(movie: Movie): Promise<Movie> {
    return await AppDataSource.getRepository(Movie).save(movie);
}
```

### Step 2: Service Layer

The service layer contains the business logic, such as validation, transaction management, and handling multiple repository interactions.

#### Validation Handling

```typescript
import { validate } from 'class-validator';
import { MovieDto } from '../dto/MovieDto';
import { plainToInstance } from 'class-transformer';
import { MovieRepository } from '../repositories/MovieRepository';

export class MovieService {
    private movieRepository = new MovieRepository();

    async addMovie(movieDto: MovieDto): Promise<MovieDto | null> {
        const movieInstance = plainToInstance(MovieDto, movieDto);
        const errors = await validate(movieInstance);

        if (errors.length > 0) {
            throw new Error('Validation failed');
        }

        return await this.movieRepository.addMovie(movieInstance);
    }
}
```

#### Handling Parameters and Body in Requests

```typescript
async getMoviesByRatingAndYear(rating: number, year: number): Promise<Movie[]> {
    return await this.movieRepository.getMoviesByCriteria(rating, year);
}
```

#### Transactional and Non-Transactional Handling

- **Transactional Example (Multiple Repository Requests):**

```typescript
import { AppDataSource } from '../ormconfig';

export class MovieService {
    async updateMovieDetails(movieDto: MovieDto): Promise<void> {
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            const movieRepository = transactionalEntityManager.getRepository(Movie);
            const genreRepository = transactionalEntityManager.getRepository(Genre);

            const genre = await genreRepository.findOneBy({ id: movieDto.genreId });
            if (!genre) throw new Error('Genre not found');

            const movie = await movieRepository.findOneBy({ id: movieDto.id });
            if (!movie) throw new Error('Movie not found');

            movie.title = movieDto.title;
            movie.genre = genre;
            await movieRepository.save(movie);
        });
    }
}
```

- **Non-Transactional Example:**

```typescript
async addNewMovie(movieDto: MovieDto): Promise<MovieDto> {
    return await this.movieRepository.addMovie(movieDto);
}
```

#### Handling HTTP Response Codes

```typescript
async getMovie(id: number): Promise<Movie> {
    const movie = await this.movieRepository.getMovieById(id);
    if (!movie) {
        throw new Error('Movie not found');
    }
    return movie;
}
```

### Step 3: Create a Controller Layer

The controller layer handles HTTP requests, delegating work to the service layer, and sending responses back to the client. Here's how you can structure your controllers:

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

#### Explanation of Error Handling in Controllers

In each route handler, we wrap the logic inside a `try` block to catch any errors that might occur. The `catch` block calls `next(e)`, passing the error to the Express error-handling middleware. This approach ensures that all errors are handled consistently and that the application doesn't crash due to unhandled exceptions.

If a specific error occurs (like a movie not being found), we can customize the response by returning the appropriate HTTP status code and message (e.g., 404 for "Not Found").

---

This completes the MVC structure setup with repository, service, and controller layers, including error handling and various use cases.


[Back To PostgreSQL Setup Navigation](#postgresql-setup-navigation)


</details>


<details>
  <summary><strong>Setting Up Backend Structure (MVC) for MongoDB Database (click to expand)</strong></summary>

  ## MongoDB Setup Navigation

  - [1. Installing Required Packages](#1-installing-required-packages)
  - [2. Setting Up In-Memory MongoDB for Unit and Integration Testing](#2-setting-up-in-memory-mongodb-for-unit-and-integration-testing)
  - [3. Basic MongoDB Configuration](#3-basic-mongodb-configuration)
  - [4. Basic MongoDB Route Creation](#4-basic-mongodb-route-creation)
  - [5. Setting Up Mongoose Models and Schemas with Validation](#5-setting-up-mongoose-models-and-schemas-with-validation)
  - [6. Setting Up an MVC Structure with Mongoose and MongoDB](#6-setting-up-an-mvc-structure-with-mongoose-and-mongodb)

---

## 1. Installing Required Packages

### Step 1: Initialize a New Node.js Project

If you haven’t already, initialize your Node.js project:

```bash
npm init -y
```

### Step 2: Install Required Packages

For MongoDB, you'll need to install `mongoose` as the ODM (Object Data Modeling) library. Mongoose provides a straightforward way to interact with MongoDB and manage data schemas. Install Mongoose with:

```bash
npm install mongoose
```

Additionally, install `mongodb-memory-server` for in-memory testing, which is useful for creating a temporary MongoDB instance during unit and integration tests:

```bash
npm install -D mongodb-memory-server
```

For testing, you should install Jest and its TypeScript types to facilitate running and writing tests:

```bash
npm install -D jest @types/jest ts-jest
```

If you are using TypeScript, configure Jest to work with TypeScript by adding a Jest configuration file:

```bash
npx ts-jest config:init
```

This setup includes Mongoose for data modeling, `mongodb-memory-server` for testing, and Jest for running and writing tests, along with necessary TypeScript types to integrate Jest smoothly into your TypeScript project.

---
[Back To MongoDB Setup Navigation](#mongodb-setup-navigation)


## 2. Setting Up In-Memory MongoDB for Unit and Integration Testing

In this step, we will set up `mongodb-memory-server` to create an in-memory MongoDB instance for running unit and integration tests. This setup allows you to test your service methods while using an in-memory MongoDB to mock the database interactions.

### Step 1: Import Required Modules

Create a new file in your `src` directory named `testDb.ts` (or a similar name). Import the necessary modules:

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
```

- **MongoMemoryServer**: A class provided by `mongodb-memory-server` to create and manage an in-memory MongoDB server.
- **mongoose**: The Mongoose library, which provides a straightforward API for interacting with MongoDB.

### Step 2: Set Up the Mock Database

Create functions to start the in-memory MongoDB server and connect to it. This will allow you to run tests against a temporary MongoDB instance:

```typescript
let mongoServer: MongoMemoryServer;

export const connect = async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};
```

- **mongoServer**: This is your in-memory MongoDB instance.
- **connect**: This function sets up the connection between the in-memory database and Mongoose.
- **closeDatabase**: This function cleans up the in-memory database and closes the connection.

### Step 3: Example Test for a Service Method

Let's use your written service methods and mock the storage layer using the in-memory MongoDB.

1. **Create a Sample Service:**

   Assume you have a service method that interacts with the MongoDB database. For example, in `movieService.ts`:

   ```typescript
   import Movie from './movieModel';

   export class MovieService {
       async addMovie(title: string, genre: string): Promise<void> {
           const movie = new Movie({ title, genre });
           await movie.save();
       }

       async getMovieByTitle(title: string) {
           return await Movie.findOne({ title });
       }
   }
   ```

2. **Write a Test Case Using Jest:**

   Create a test file, for example, `movieService.test.ts`, and write a test case:

   ```typescript
   import { connect, closeDatabase } from './testDb';
   import { MovieService } from './movieService';

   let movieService: MovieService;

   beforeAll(async () => {
       await connect();
       movieService = new MovieService();
       await mongoose.connection.db.createCollection('movies');
   });

   afterAll(async () => await closeDatabase());

   describe('MovieService Test', () => {
       it('should add and retrieve a movie successfully', async () => {
           await movieService.addMovie('Inception', 'Sci-Fi');
           const movie = await movieService.getMovieByTitle('Inception');
           expect(movie).toBeDefined();
           expect(movie?.title).toBe('Inception');
           expect(movie?.genre).toBe('Sci-Fi');
       });
   });
   ```

   - **beforeAll**: Initializes the in-memory database and the service instance before running any tests. It also ensures the movies collection is created.
   - **afterAll**: Closes the database connection and stops the in-memory MongoDB server after all tests have run.
   - **it**: Tests the `MovieService` methods to ensure they correctly interact with the in-memory database.

### Step 4: Run the Tests with Jest

Finally, run your tests to ensure everything works correctly. If you have Jest installed, you can run:

```bash
npx jest
```

Jest will automatically find and run all test files in your project that match the pattern `*.test.ts`.

---

[Back To MongoDB Setup Navigation](#mongodb-setup-navigation)


## 3. Basic MongoDB Configuration

In this step, we'll configure the connection to a MongoDB database using the Mongoose library. This configuration will allow your application to connect to the MongoDB database and perform various operations such as querying, inserting, updating, and deleting data.

### Step 1: Create a Database Configuration File

Create a new directory named `config` inside your `src` directory. Inside `config`, create a file named `db.ts` to hold your database configuration:

```typescript
// src/config/db.ts
import mongoose from 'mongoose';

// Create a new connection string for MongoDB
const dbUri = 'mongodb://localhost:27017/mydb'; // Connection URI

// Connect to MongoDB using Mongoose
const connectToDatabase = async () => {
    try {
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

// Export the connection function
export default connectToDatabase;
```

- **dbUri**: The connection URI for your MongoDB server. `localhost:27017` is the default for a local MongoDB instance.
- **connectToDatabase**: This function connects to the MongoDB server using Mongoose and logs the connection status.

### Step 2: Use the Database Configuration in Your Application

To use this configuration in other parts of your application, simply call the `connectToDatabase` function wherever you need to interact with the database.

For example, in a service or application startup file:

```typescript
// src/app.ts
import connectToDatabase from './config/db';

const startServer = async () => {
    await connectToDatabase();
    
    // Your application code here
};

startServer();
```

Here, the `connectToDatabase` function establishes a connection to MongoDB before starting the application server.

### Step 3: Test the Configuration

To ensure your configuration is working correctly, you can create a simple script to connect to the database and perform a basic query.

Create a file `src/testDbConnection.ts`:

```typescript
import mongoose from 'mongoose';
import connectToDatabase from './config/db';

const testConnection = async () => {
    await connectToDatabase();

    try {
        const result = await mongoose.connection.db.admin().serverStatus();
        console.log('Database connected:', result.version);
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

testConnection();
```

Run this script using ts-node to test the connection:

```bash
npx ts-node src/testDbConnection.ts
```

If your configuration is correct, you should see a message in the console indicating that the database is connected, along with the MongoDB server version.



[Back To MongoDB Setup Navigation](#mongodb-setup-navigation)


## 4. Basic MongoDB Route Creation

In this step, we’ll create basic routes for handling HTTP requests using Express.js, specifically tailored for MongoDB. We’ll cover how to set up GET, POST, and parameterized routes, as well as how to handle query parameters.

### Step 1: Creating the Movies Router

Create a new directory named `routes` inside your `src` directory. Inside `routes`, create a file named `moviesRouter.ts`:

```typescript
import express, { Request, Response, NextFunction } from 'express';
import Movie from '../models/movieModel'; // Assuming you have a Mongoose model defined

const moviesRouter = express.Router();

// Example: GET Route
moviesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            res.status(400).send('Query parameter "q" is required');
            return;
        }

        // Fetch movies based on the query
        const movies = await Movie.find({ title: new RegExp(query, 'i') });

        res.json(movies);
    } catch (e) {
        next(e);
    }
});

// Example: POST Route
moviesRouter.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre } = req.body;

        if (!title || !genre) {
            res.status(400).send('Title and Genre are required');
            return;
        }

        const newMovie = new Movie({ title, genre });
        await newMovie.save();

        res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
    } catch (e) {
        next(e);
    }
});

// Example: Route with Parameter
moviesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Fetch a movie by ID
        const movie = await Movie.findById(id);

        if (!movie) {
            res.status(404).send('Movie not found');
            return;
        }

        res.json(movie);
    } catch (e) {
        next(e);
    }
});

export default moviesRouter;
```

- **GET Route**: Handles requests to `/movies` and optionally accepts a query parameter `q`. If `q` is provided, it returns a list of movies whose titles match the query using a case-insensitive regular expression.
- **POST Route**: Handles requests to `/movies/add`. It expects a movie object in the request body and adds it to the MongoDB collection.
- **Parameterized Route**: Handles requests to `/movies/:id`, where `:id` is a dynamic parameter representing a movie’s ID. It fetches the movie from the MongoDB collection by its ID.

### Step 2: Example Client-Side Integration

For the POST route `/movies/add`, here’s how you might integrate it on the client side:

```typescript
const handleAddFavoriteMovie = async (movie: { title: string; genre: string }) => {
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

This function sends a POST request to the `/movies/add` endpoint to add a new movie. The movie object should include `title` and `genre` as properties.

This section outlines the creation of basic routes for handling movies in your MongoDB database using Express.js.


[Back To MongoDB Setup Navigation](#mongodb-setup-navigation)


## 5. Setting Up Mongoose Models and Schemas with Validation


In this step, we'll configure Mongoose models, use DTOs (Data Transfer Objects) for validation, and set up a basic repository layer. We'll ensure that the Mongoose schema integrates validation using `class-validator` and handle MongoDB operations within the repository.

### Step 1: Define the Movie DTO with Validation

First, create a DTO (Data Transfer Object) for the Movie entity using `class-validator`. This DTO will handle validation logic before the data is saved to MongoDB.

```typescript
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

export class MovieDto extends Document {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    genreId: string;

    @IsNotEmpty()
    @IsBoolean()
    isFavorite: boolean;

    constructor(title: string, genreId: string, isFavorite: boolean) {
        super();
        this.title = title;
        this.genreId = genreId;
        this.isFavorite = isFavorite;
    }
}
```

In this DTO:

- `@IsNotEmpty()` ensures the field is not empty.
- `@IsString()` validates that the field is a string.
- `@IsBoolean()` ensures the field is a boolean.

### Step 2: Create Mongoose Schemas

Next, define the Mongoose schema for the Movie entity. This schema will be connected with the `MovieDto` class to ensure that the data meets the defined structure and validation rules.

```typescript
import { Schema, model } from 'mongoose';
import { MovieDto } from './dto/MovieDto';

const MovieSchema = new Schema<MovieDto>({
    title: { type: String, required: true },
    genreId: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
    isFavorite: { type: Boolean, required: true },
});

export const Movie = model<MovieDto>('Movie', MovieSchema);
```

In this schema:

- `title` and `genreId` are string fields with the `required` property to ensure that these fields are always present.
- `genreId` is a reference to another collection (`Genre`), showcasing a relationship.

### Step 3: Understanding Mongoose Schema Options

Mongoose provides various schema options that allow you to define your data model's structure and constraints more effectively. Here are some important options:

#### 1. **Data Types**

Mongoose supports various data types, including:

- **String**: Represents textual data.
- **Number**: Represents numerical data.
- **Boolean**: Represents true/false values.
- **Date**: Represents date and time.
- **Buffer**: Represents binary data.
- **ObjectId**: A special type used to reference other documents (i.e., foreign keys).
- **Array**: Represents an array of sub-documents or any other type.

#### 2. **Schema Options**

When defining schemas, Mongoose allows you to use a wide range of options:

- **required**: Ensures that a field is required.
- **default**: Provides a default value if none is supplied.
- **unique**: Ensures that each value for this field is unique across the collection.
- **enum**: Restricts the value of a field to a specific set of values.
- **min/max**: Sets the minimum and maximum values for numbers.
- **minLength/maxLength**: Sets the minimum and maximum length for strings.
- **index**: Creates an index on the field for faster queries.

Example of a more complex schema:

```typescript
const GenreSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: 'No description provided' },
    createdAt: { type: Date, default: Date.now },
});
```

#### 3. **Relationships and References**

- **ref**: Used to define relationships between documents. It tells Mongoose which model to reference when populating the field.
  
  ```typescript
  const MovieSchema = new Schema({
      title: { type: String, required: true },
      genre: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
  });
  ```

- **populate()**: A method that can be used to automatically replace the specified paths in the document with documents from other collections.

#### 4. **Custom Validation**

Mongoose allows you to create custom validation logic directly in the schema definition:

```typescript
const MovieSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v: string) {
                return v.length > 3;
            },
            message: props => `${props.value} is too short!`
        }
    },
});
```

In this example, the `title` field must be longer than 3 characters.

---

[Back To MongoDB Setup Navigation](#mongodb-setup-navigation)


## 6. Setting Up an MVC Structure with Mongoose and MongoDB


In this chapter, we’ll establish the Model-View-Controller (MVC) structure for your application, focusing on the repository, service, and controller layers. Each layer has its own responsibilities, and together they form the backbone of your application.

### Step 1: Repository Layer

The repository layer interacts directly with the MongoDB database, providing methods to retrieve, insert, update, and delete data. This section covers different approaches to querying the database using Mongoose.

#### Example: Movie Repository Class

```typescript
import { Movie } from '../models/Movie';
import { MovieDto } from '../dto/MovieDto';

export class MovieRepository {
    async getAllMovies(): Promise<Movie[]> {
        return await Movie.find();
    }

    async getMovieById(id: string): Promise<Movie | null> {
        return await Movie.findById(id);
    }

    async getMoviesByGenre(genreId: string): Promise<Movie[]> {
        return await Movie.find({ genreId });
    }

    async addMovie(movieDto: MovieDto): Promise<Movie> {
        const movie = new Movie(movieDto);
        return await movie.save();
    }

    async updateMovie(id: string, movieDto: Partial<MovieDto>): Promise<Movie | null> {
        return await Movie.findByIdAndUpdate(id, movieDto, { new: true });
    }

    async deleteMovie(id: string): Promise<void> {
        await Movie.findByIdAndDelete(id);
    }
}
```

#### Explanation:

- **getAllMovies**: Retrieves all movies from the database.
- **getMovieById**: Fetches a specific movie by its ID.
- **getMoviesByGenre**: Retrieves movies filtered by genre ID.
- **addMovie**: Adds a new movie to the database.
- **updateMovie**: Updates an existing movie’s details.
- **deleteMovie**: Deletes a movie from the database.

#### Partial Type in TypeScript

The `Partial<T>` type in TypeScript allows you to create a type with all properties of `T` set to optional. This is particularly useful when updating an entity, as you may not want to update every field.

### Step 2: Service Layer

The service layer contains the business logic, such as validation, transaction management, handling multiple repository interactions, and throwing custom errors.

#### Custom Error Handling

Creating custom errors allows for more specific error handling across the service and controller layers.

##### Example: Custom Error Classes

```typescript
class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
```

#### Validation Handling

Before saving data to MongoDB, we validate the incoming data using `class-validator` within the service layer.

```typescript
import { validate } from 'class-validator';
import { MovieDto } from '../dto/MovieDto';
import { plainToInstance } from 'class-transformer';
import { MovieRepository } from '../repositories/MovieRepository';
import { ValidationError } from '../errors/CustomErrors';

export class MovieService {
    private movieRepository = new MovieRepository();

    async addMovie(movieDto: MovieDto): Promise<MovieDto | null> {
        const movieInstance = plainToInstance(MovieDto, movieDto);
        const errors = await validate(movieInstance);

        if (errors.length > 0) {
            throw new ValidationError('Validation failed');
        }

        return await this.movieRepository.addMovie(movieInstance);
    }
}
```

#### Handling Parameters and Body in Requests

We can handle different query parameters and request bodies in the service methods.

```typescript
async getMoviesByRatingAndYear(rating: number, year: number): Promise<Movie[]> {
    return await this.movieRepository.getMoviesByCriteria(rating, year);
}
```

#### Transactional and Non-Transactional Handling

MongoDB supports transactions in replica set environments, allowing you to perform multiple operations atomically.

##### Example: Transactional Update of Movie Details

```typescript
import { startSession } from 'mongoose';
import { NotFoundError } from '../errors/CustomErrors';

export class MovieService {
    async updateMovieDetails(movieDto: MovieDto): Promise<void> {
        const session = await startSession();
        session.startTransaction();

        try {
            const movie = await this.movieRepository.updateMovie(movieDto.id, movieDto);
            if (!movie) throw new NotFoundError('Movie not found');

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
```

##### Example: Non-Transactional Add Movie

```typescript
export class MovieService {
    async addNewMovie(movieDto: MovieDto): Promise<Movie> {
        return await this.movieRepository.addMovie(movieDto);
    }
}
```

#### Handling HTTP Response Codes

The service layer can handle various HTTP response codes depending on the outcome of the business logic by throwing appropriate custom errors.

##### Example: Handling Different Response Scenarios

```typescript
export class MovieService {
    private movieRepository = new MovieRepository();

    async getMovie(id: string): Promise<Movie> {
        const movie = await this.movieRepository.getMovieById(id);
        if (!movie) {
            throw new NotFoundError('Movie not found');
        }
        return movie;
    }

    async updateMovie(movieDto: MovieDto): Promise<Movie> {
        const movie = await this.movieRepository.updateMovie(movieDto.id, movieDto);
        if (!movie) {
            throw new NotFoundError('Movie not found');
        }
        return movie;
    }

    async deleteMovie(id: string): Promise<void> {
        const movie = await this.movieRepository.getMovieById(id);
        if (!movie) {
            throw new NotFoundError('Movie not found');
        }
        await this.movieRepository.deleteMovie(id);
    }
}
```

### Step 3: Create a Controller Layer

The controller layer handles HTTP requests, delegating work to the service layer, and sending responses back to the client, including appropriate HTTP status codes.

##### Example: Movie Controller

```typescript
import express, { Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/MovieService';
import { MovieDto } from '../dto/MovieDto';
import { NotFoundError, ValidationError } from '../errors/CustomErrors';

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
        if (e instanceof ValidationError) {
            res.status(400).json({ error: e.message });
        } else {
            next(e);
        }
    }
});

// GET Route with Parameter
moviesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const movie = await movieService.getMovie(id);
        res.json(movie);
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).json({ error: e.message });
        } else {
            next(e);
        }
    }
});

// PUT Route
moviesRouter.put('/update', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = req.body as MovieDto;
        const movie = await movieService.updateMovie(dto);
        res.json(movie);
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).json({ error: e.message });
        } else if (e instanceof ValidationError) {
            res.status(400).json({ error: e.message });
        } else {
            next(e);
        }
    }
});

// DELETE Route
moviesRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        await movieService.deleteMovie(id);
        res.status(204).send();
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).json({ error: e.message });
        } else {
            next(e);
        }
    }
});

export default moviesRouter;
```

#### Explanation of Error Handling in Controllers

In each route handler, the logic is wrapped in a `try` block to catch any errors. Depending on the error type, the controller sends the appropriate HTTP status code. If the error is a known custom error, like `NotFoundError` or `ValidationError`, a specific response is sent; otherwise, the error is passed to the next middleware for further handling.


[Back To MongoDB Setup Navigation](#mongodb-setup-navigation)


</details>



<details>
  <summary><strong>Redis Functionality Overview and Usage (click to expand)</strong></summary>
[Back To  Redis Overview Navigation](#redis-overview-navigation)

## Redis Overview Navigation
- [Available Methods](#available-methods)
  - [Basic Commands](#basic-commands)
  - [Working with Sets](#working-with-sets)
  - [Working with Lists](#working-with-lists)
  - [Working with Ordered Lists (Sorted Sets)](#working-with-ordered-lists-sorted-sets)
  - [Working with Objects as Values (Hashes)](#working-with-objects-as-values-hashes)
  - [Working with Geospatial Data](#working-with-geospatial-data)
  - [Pub/Sub (Publish/Subscribe Messaging)](#pubsub-publishsubscribe-messaging)
  - [Transactions and Pipelining](#transactions-and-pipelining)
  - [Stream Data Type](#stream-data-type)
  - [HyperLogLog](#hyperloglog)
  - [Bitmaps](#bitmaps)
  - [Persistence Options](#persistence-options)
- [Use Cases](#use-cases)
  - [Caching with Redis](#caching-with-redis)
  - [Session Management with Redis](#session-management-with-redis)
  - [Delivery Service with Geospatial Data](#delivery-service-with-geospatial-data)
  - [Time-Dependent Attempt Limits](#time-dependent-attempt-limits)
  - [Daily Quota Management](#daily-quota-management)
  - [Ranking Items](#ranking-items)
  - [Calculating Average Ratings](#calculating-average-ratings)
  - [Real-Time Rating Updates](#real-time-rating-updates)
  - [Site Visits Metadata](#site-visits-metadata)
  - [Site Scrolling Metadata](#site-scrolling-metadata)
  - [Site Duration Metadata](#site-duration-metadata)
  - [Site Mouse Click Data Heatmaps](#site-mouse-click-data-heatmaps)


## Available Methods

### Basic Commands

Redis provides a set of basic commands for interacting with key-value pairs. These commands are foundational and are frequently used in various operations.

- **SET**: Sets the value of a key. If the key already holds a value, it is overwritten. You can also set an expiration time and other options.

  ```bash
  SET key "value"                  # Basic set command
  SET key "value" EX 3600          # Set with expiration time (3600 seconds)
  SET key "value" NX               # Set value only if the key does not already exist
  ```

- **GET**: Retrieves the value associated with a key.

  ```bash
  GET key
  ```

- **DEL**: Deletes one or more keys.

  ```bash
  DEL key                          # Delete a single key
  DEL key1 key2 key3               # Delete multiple keys
  ```

- **EXPIRE**: Sets a timeout on a key, after which the key will be automatically deleted. 

  ```bash
  EXPIRE key 3600                  # Set expiration time to 3600 seconds (1 hour)
  EXPIRE key 60                    # Set expiration time to 60 seconds
  ```

- **INCR/DECR**: Increments or decrements the value of a key by one. If the key does not exist, it is set to 0 before performing the operation.

  ```bash
  INCR counter                     # Increment the counter by 1
  DECR counter                     # Decrement the counter by 1
  INCRBY counter 10               # Increment the counter by 10
  DECRBY counter 5                # Decrement the counter by 5
  ```

These commands cover the most common operations for managing simple key-value data in Redis. Each command has variations to handle different use cases and requirements.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Working with Sets

Redis sets are unordered collections of unique elements. They provide various commands for adding, removing, and querying elements in a set.

- **SADD**: Adds one or more members to a set. If the set does not exist, a new set is created.

  ```bash
  SADD myset "element1" "element2"  # Add multiple elements
  SADD myset "element3"             # Add a single element
  ```

- **SREM**: Removes one or more members from a set.

  ```bash
  SREM myset "element1" "element2"  # Remove multiple elements
  SREM myset "element3"             # Remove a single element
  ```

- **SMEMBERS**: Retrieves all the members of a set.

  ```bash
  SMEMBERS myset
  ```

- **SISMEMBER**: Checks if a value is a member of a set.

  ```bash
  SISMEMBER myset "element1"
  ```

- **SUNION/SINTER**: Performs a union or intersection on multiple sets.

  ```bash
  SUNION set1 set2                 # Returns the union of set1 and set2
  SINTER set1 set2                 # Returns the intersection of set1 and set2
  ```

- **SDIFF**: Returns the members of the set resulting from the difference between the first set and all the successive sets.

  ```bash
  SDIFF set1 set2                 # Returns the difference between set1 and set2
  ```

- **SMOVE**: Moves a member from one set to another.

  ```bash
  SMOVE source_set destination_set "element"
  ```

These commands allow you to efficiently manage and query sets, making Redis a powerful tool for operations involving unique collections of data.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Working with Lists

Redis lists are ordered collections of elements. They support various operations for manipulating and querying lists.

- **LPUSH**: Adds one or more elements to the beginning (head) of a list. If the list does not exist, it is created.

  ```bash
  LPUSH mylist "element1" "element2"  # Add multiple elements to the head of the list
  LPUSH mylist "element3"             # Add a single element to the head
  ```

- **RPUSH**: Adds one or more elements to the end (tail) of a list.

  ```bash
  RPUSH mylist "element1" "element2"  # Add multiple elements to the tail of the list
  RPUSH mylist "element3"             # Add a single element to the tail
  ```

- **LPOP**: Removes and returns the first element of a list.

  ```bash
  LPOP mylist
  ```

- **RPOP**: Removes and returns the last element of a list.

  ```bash
  RPOP mylist
  ```

- **LRANGE**: Retrieves a range of elements from a list, specified by the start and end indices.

  ```bash
  LRANGE mylist 0 10                # Get elements from index 0 to 10 (inclusive)
  LRANGE mylist 1 -1                # Get elements from index 1 to the end of the list
  ```

- **LLEN**: Returns the length of a list.

  ```bash
  LLEN mylist
  ```

- **LINSERT**: Inserts a value before or after another value in the list.

  ```bash
  LINSERT mylist BEFORE "pivot" "new_element"  # Insert "new_element" before "pivot"
  LINSERT mylist AFTER "pivot" "new_element"   # Insert "new_element" after "pivot"
  ```

- **LSET**: Sets the value of an element in a list by its index.

  ```bash
  LSET mylist 2 "new_value"           # Set the element at index 2 to "new_value"
  ```

These commands enable you to perform various operations on lists, including adding, removing, and accessing elements in an ordered sequence.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Working with Ordered Lists (Sorted Sets)

Redis sorted sets are similar to sets but with a unique feature: each element is associated with a score that is used to order the elements. This makes them useful for scenarios where you need to maintain an ordered collection of items.

- **ZADD**: Adds one or more members to a sorted set, or updates the score of an existing member. If the sorted set does not exist, it is created.

  ```bash
  ZADD mysortedset 1 "element1"        # Add an element with score 1
  ZADD mysortedset 2 "element2"        # Add an element with score 2
  ZADD mysortedset 3 "element3"        # Add an element with score 3
  ZADD mysortedset 4 "element4" NX     # Add element only if it does not already exist
  ```

- **ZRANGE**: Retrieves a range of members from a sorted set, by index, ordered from the lowest to the highest score.

  ```bash
  ZRANGE mysortedset 0 2               # Get elements with indices 0 to 2
  ZRANGE mysortedset 0 -1              # Get all elements
  ```

- **ZRANGEBYSCORE**: Retrieves members within a specified score range, ordered from the lowest to the highest score.

  ```bash
  ZRANGEBYSCORE mysortedset 1 3        # Get elements with scores between 1 and 3
  ```

- **ZSCORE**: Retrieves the score of a member in a sorted set.

  ```bash
  ZSCORE mysortedset "element1"        # Get the score of "element1"
  ```

- **ZREM**: Removes one or more members from a sorted set.

  ```bash
  ZREM mysortedset "element1" "element2"  # Remove multiple elements
  ZREM mysortedset "element3"             # Remove a single element
  ```

- **ZREMRANGEBYRANK**: Removes all members in a sorted set within the specified rank range.

  ```bash
  ZREMRANGEBYRANK mysortedset 0 1        # Remove elements with ranks 0 and 1
  ```

- **ZREMRANGEBYSCORE**: Removes all members in a sorted set within the specified score range.

  ```bash
  ZREMRANGEBYSCORE mysortedset 1 3       # Remove elements with scores between 1 and 3
  ```

These commands facilitate the management of ordered collections in Redis, allowing you to efficiently handle and query sorted data.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Working with Objects as Values (Hashes)

Redis hashes are maps between string field and string values, making them ideal for storing objects with multiple attributes. Each field in a hash is unique and maps to a value.

- **HSET**: Sets the value of a field in a hash. If the hash does not exist, a new hash is created.

  ```bash
  HSET myhash field1 "value1"        # Set field1 in hash to "value1"
  HSET myhash field2 "value2"        # Set field2 in hash to "value2"
  ```

- **HMSET**: Sets multiple fields in a hash at once.

  ```bash
  HMSET myhash field1 "value1" field2 "value2"  # Set multiple fields
  ```

- **HGET**: Retrieves the value of a field in a hash.

  ```bash
  HGET myhash field1                # Get the value of field1
  ```

- **HMGET**: Retrieves the values of multiple fields in a hash.

  ```bash
  HMGET myhash field1 field2       # Get values of field1 and field2
  ```

- **HDEL**: Deletes one or more fields from a hash.

  ```bash
  HDEL myhash field1 field2        # Remove field1 and field2 from the hash
  ```

- **HGETALL**: Retrieves all fields and values from a hash.

  ```bash
  HGETALL myhash                   # Get all fields and values
  ```

- **HLEN**: Returns the number of fields in a hash.

  ```bash
  HLEN myhash                      # Get the number of fields
  ```

- **HKEYS**: Returns all field names in a hash.

  ```bash
  HKEYS myhash                     # Get all field names
  ```

- **HVALS**: Returns all values in a hash.

  ```bash
  HVALS myhash                     # Get all values
  ```

These commands allow you to manage and query hash data structures efficiently, providing a versatile way to handle objects with multiple attributes in Redis.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Working with Geospatial Data

Redis supports geospatial data types and commands to manage and query location-based data. This is useful for applications that involve location-based services, such as finding nearby places or tracking positions.

- **GEOADD**: Adds a geospatial item (point) with a specified longitude, latitude, and name to a sorted set. The item is stored as a member in a sorted set where the score is calculated from its coordinates.

  ```bash
  GEOADD mygeospatialset 13.361389 38.115656 "Palermo"   # Add location with coordinates and name
  GEOADD mygeospatialset 15.087269 37.502669 "Catania"   # Add another location
  ```

- **GEOPOS**: Retrieves the longitude and latitude of one or more members in a geospatial set.

  ```bash
  GEOPOS mygeospatialset "Palermo"   # Get coordinates for "Palermo"
  GEOPOS mygeospatialset "Catania"   # Get coordinates for "Catania"
  ```

- **GEODIST**: Calculates the distance between two members in a geospatial set. The distance can be specified in meters, kilometers, miles, or feet.

  ```bash
  GEODIST mygeospatialset "Palermo" "Catania" km  # Calculate distance between Palermo and Catania in kilometers
  ```

- **GEORADIUS**: Retrieves all members in a geospatial set within a specified radius from a given point. The radius is specified in meters, kilometers, miles, or feet.

  ```bash
  GEORADIUS mygeospatialset 15.087269 37.502669 100 km    # Find members within 100 km of the given coordinates
  GEORADIUS mygeospatialset 15.087269 37.502669 200 km WITHDIST  # Find members within 200 km and include distance
  ```

- **GEORADIUSBYMEMBER**: Retrieves all members within a specified radius from a given member in the geospatial set.

  ```bash
  GEORADIUSBYMEMBER mygeospatialset "Catania" 50 km       # Find members within 50 km of "Catania"
  GEORADIUSBYMEMBER mygeospatialset "Catania" 100 km WITHDIST # Find members within 100 km of "Catania" and include distance
  ```

These commands enable effective management and querying of geospatial data, allowing for powerful location-based functionalities in Redis.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Pub/Sub (Publish/Subscribe Messaging)

Redis provides a publish/subscribe (pub/sub) messaging system that allows for message broadcasting to multiple subscribers. This feature is useful for scenarios where real-time messaging or notifications are needed.

- **PUBLISH**: Sends a message to a specified channel. All clients subscribed to that channel will receive the message.

  ```bash
  PUBLISH mychannel "Hello, Redis!"  # Send a message to the "mychannel" channel
  ```

- **SUBSCRIBE**: Subscribes to one or more channels. Messages published to these channels will be received by the subscriber.

  ```bash
  SUBSCRIBE mychannel   # Subscribe to the "mychannel" channel
  ```

- **UNSUBSCRIBE**: Unsubscribes from one or more channels. If no channels are specified, it unsubscribes from all channels.

  ```bash
  UNSUBSCRIBE mychannel   # Unsubscribe from the "mychannel" channel
  ```

- **PSUBSCRIBE**: Subscribes to channels matching a pattern. This allows for more flexible subscriptions where messages can be received from multiple channels that match the pattern.

  ```bash
  PSUBSCRIBE "news.*"    # Subscribe to all channels matching the pattern "news.*"
  ```

- **PUNSUBSCRIBE**: Unsubscribes from channels matching a pattern. Like `PSUBSCRIBE`, this allows unsubscribing from multiple channels.

  ```bash
  PUNSUBSCRIBE "news.*"  # Unsubscribe from all channels matching the pattern "news.*"
  ```

Pub/Sub in Redis facilitates real-time messaging by allowing clients to publish messages to channels and other clients to subscribe and receive those messages. This is particularly useful for building notification systems, chat applications, and other real-time features.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Transactions and Pipelining

Redis supports transactions and pipelining to optimize operations and manage multiple commands more efficiently.

- **MULTI**: Starts a transaction block. Commands issued after this command are queued for execution and will be executed atomically when `EXEC` is called.

  ```bash
  MULTI                         # Start a transaction block
  SET key1 "value1"             # Queue commands
  SET key2 "value2"
  EXEC                          # Execute all commands in the transaction
  ```

- **EXEC**: Executes all commands in the transaction block started by `MULTI`.

  ```bash
  MULTI
  SET key1 "value1"
  SET key2 "value2"
  EXEC                          # All commands are executed as a single atomic operation
  ```

- **DISCARD**: Aborts the transaction block started by `MULTI` and discards all queued commands.

  ```bash
  MULTI
  SET key1 "value1"
  SET key2 "value2"
  DISCARD                        # Discard all queued commands without execution
  ```

- **WATCH**: Monitors one or more keys for changes. If any of the watched keys are modified before the transaction is executed, the transaction is aborted.

  ```bash
  WATCH key1                     # Monitor key1 for changes
  MULTI
  SET key1 "value1"
  EXEC                          # If key1 is modified, transaction will not execute
  ```

- **Pipelining**: Allows multiple commands to be sent to the Redis server in a single request. This reduces the network overhead and can significantly speed up the execution of multiple commands.

  ```bash
  # Example using Redis CLI (not a single command but shows pipelining concept)
  redis-cli --pipe <<EOF
  SET key1 "value1"
  SET key2 "value2"
  SET key3 "value3"
  EOF
  ```

Transactions and pipelining in Redis provide powerful mechanisms for handling multiple commands efficiently. Transactions ensure atomic execution of commands, while pipelining improves performance by reducing round-trip times between the client and server.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Stream Data Type

Redis Streams are a data structure that represents a log of messages, where each message is identified by a unique ID and can contain multiple fields and values. Streams are useful for building real-time data pipelines and event sourcing systems.

- **XADD**: Adds a new entry to a stream. The entry is identified by a unique ID generated by Redis, or you can specify your own ID.

  ```bash
  XADD mystream * "field1" "value1" "field2" "value2"  # Add an entry with auto-generated ID
  XADD mystream 1686100800000-0 "field1" "value1"     # Add an entry with a specific ID
  ```

- **XRANGE**: Retrieves a range of entries from a stream. You can specify a range of IDs or use special IDs like `-` for the first entry and `+` for the latest entry.

  ```bash
  XRANGE mystream - +           # Get all entries in the stream
  XRANGE mystream 1686100800000-0 1686100800000-5  # Get entries within a specific ID range
  ```

- **XREVRANGE**: Retrieves a range of entries from a stream in reverse order. This is useful for querying the most recent entries first.

  ```bash
  XREVRANGE mystream + -           # Get all entries in reverse order
  XREVRANGE mystream 1686100800000-5 1686100800000-0  # Get entries within a specific ID range in reverse order
  ```

- **XREAD**: Reads new entries from one or more streams. This command is often used to consume data from a stream in a blocking manner.

  ```bash
  XREAD COUNT 2 STREAMS mystream 0  # Read up to 2 new entries from the stream, starting from ID 0
  XREAD BLOCK 5000 COUNT 2 STREAMS mystream 0  # Block for up to 5000 milliseconds if no new entries are available
  ```

- **XDEL**: Deletes specific entries from a stream by their IDs. This is useful for cleaning up old or irrelevant data.

  ```bash
  XDEL mystream 1686100800000-0  # Delete the entry with a specific ID
  ```

- **XTRIM**: Trims a stream to a specified length or maximum size. This helps in managing memory usage by removing older entries.

  ```bash
  XTRIM mystream MAXLEN 1000      # Trim the stream to keep at most 1000 entries
  XTRIM mystream MINID 1686100800000-0  # Trim the stream to keep entries with IDs greater than the specified ID
  ```

Redis Streams offer a powerful way to handle time-series data and real-time messaging, making them suitable for various applications such as logging, messaging, and event sourcing.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### HyperLogLog

Redis HyperLogLog is a probabilistic data structure used to estimate the cardinality (i.e., the number of unique elements) of a set. It is highly space-efficient and useful for scenarios where exact counting is not necessary but an approximate count is sufficient.

- **PFADD**: Adds elements to a HyperLogLog data structure. This command updates the HyperLogLog with new elements, which will be used to estimate the number of unique elements.

  ```bash
  PFADD myhyperloglog "element1" "element2" "element3"  # Add elements to the HyperLogLog
  ```

- **PFCOUNT**: Returns the approximated cardinality (number of unique elements) of the HyperLogLog. This command provides an estimate based on the data added.

  ```bash
  PFCOUNT myhyperloglog     # Get the approximate number of unique elements
  ```

- **PFMERGE**: Merges multiple HyperLogLogs into one. This is useful for combining data from different sources or partitions.

  ```bash
  PFMERGE mymergedhyperloglog myhyperloglog1 myhyperloglog2  # Merge multiple HyperLogLogs
  ```

HyperLogLog is particularly useful when working with large datasets where memory efficiency is crucial. It provides an approximate count of unique elements with very low memory usage, making it ideal for analytics and monitoring tasks where exact precision is less critical.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Bitmaps

Redis Bitmaps are a data structure used to handle binary data, allowing you to set, clear, and query bits. They are useful for operations like tracking user activity, managing flags, or implementing compact data storage.

- **SETBIT**: Sets or clears the bit at a specific offset in the bitmap. If the offset is greater than the current size of the bitmap, the bitmap will be extended.

  ```bash
  SETBIT mybitmap 7 1    # Set the bit at offset 7 to 1 (true)
  SETBIT mybitmap 7 0    # Clear the bit at offset 7 (set to 0)
  ```

- **GETBIT**: Retrieves the value of the bit at a specific offset. Returns 0 if the bit is not set.

  ```bash
  GETBIT mybitmap 7      # Get the value of the bit at offset 7
  ```

- **BITCOUNT**: Counts the number of set bits (bits with value 1) in the bitmap. You can specify a range of bytes to count.

  ```bash
  BITCOUNT mybitmap      # Count all set bits in the bitmap
  BITCOUNT mybitmap 0 1  # Count set bits in the range of bytes 0 to 1
  ```

- **BITOP**: Performs bitwise operations (AND, OR, XOR, NOT) between multiple bitmaps and stores the result in a destination bitmap.

  ```bash
  BITOP AND resultbitmap mybitmap1 mybitmap2  # Perform AND operation on mybitmap1 and mybitmap2, store result in resultbitmap
  BITOP OR resultbitmap mybitmap1 mybitmap2   # Perform OR operation
  BITOP XOR resultbitmap mybitmap1 mybitmap2  # Perform XOR operation
  BITOP NOT resultbitmap mybitmap             # Perform NOT operation
  ```

- **BITPOS**: Finds the first bit set to 1 or 0, starting from a given offset. Useful for searching within a bitmap.

  ```bash
  BITPOS mybitmap 1     # Find the first bit set to 1
  BITPOS mybitmap 0 10  # Find the first bit set to 0, starting from offset 10
  ```

Redis Bitmaps provide a compact and efficient way to manage binary data, enabling various applications such as user activity tracking, implementing flags or states, and performing efficient data processing tasks.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Persistence Options

Redis offers different persistence options to ensure data durability and recovery. You can choose between snapshotting and append-only file (AOF) based persistence, or use both together for greater reliability.

- **RDB (Redis Database Backup)**: Creates point-in-time snapshots of the dataset at specified intervals. RDB files are compact and efficient for backups but do not provide real-time durability.

  - Configuration: Set in `redis.conf` with the `save` directive.
  
    ```bash
    # Save the dataset every 60 seconds if at least 1000 keys changed
    save 60 1000
    ```

  - **BGSAVE**: Triggers a background save operation to create an RDB snapshot.

    ```bash
    BGSAVE   # Initiates a background save operation
    ```

  - **LASTSAVE**: Returns the UNIX timestamp of the last successful RDB save.

    ```bash
    LASTSAVE  # Get the timestamp of the last RDB save
    ```

- **AOF (Append-Only File)**: Logs every write operation received by the server. AOF provides better durability by replaying the logs to reconstruct the dataset.

  - Configuration: Set in `redis.conf` with the `appendonly` directive.
  
    ```bash
    appendonly yes    # Enable AOF persistence
    appendfsync everysec   # Sync every second
    ```

  - **BGREWRITEAOF**: Triggers a background rewrite of the AOF file to optimize its size.

    ```bash
    BGREWRITEAOF   # Initiates a background rewrite of the AOF file
    ```

  - **AOFLOAD**: Replays the AOF log during startup to reconstruct the dataset.

    ```bash
    # No specific command for AOF loading; done automatically on startup
    ```

- **Hybrid Approach**: You can use both RDB and AOF together to combine the benefits of both methods. This approach ensures both fast restarts and durability.

  - Configuration: Set in `redis.conf` to enable both RDB and AOF.

    ```bash
    save 60 1000      # RDB settings
    appendonly yes    # AOF settings
    ```

- **Redis Persistence Configuration Tips**:
  - **RDB**: Good for backups and quick restarts; less frequent durability.
  - **AOF**: Better for durability; larger files and slower restarts.
  - **Hybrid**: Balances durability with efficient restart times.

Redis's persistence options allow you to choose the right balance between performance and durability based on your application's requirements.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

## Use Cases


### Caching with Redis

Redis is widely used for caching to improve performance by storing frequently accessed data in memory. Caching with Redis helps reduce the load on databases and improves response times for applications.

- **SET**: Stores a key-value pair in Redis with optional expiration time. This is useful for caching data with a defined time-to-live (TTL).

  ```bash
  SET cachekey "cached value" EX 300   # Set a key with value and expiration time of 300 seconds
  ```

- **GET**: Retrieves the value associated with a key. If the key does not exist or has expired, it returns nil.

  ```bash
  GET cachekey   # Retrieve the cached value associated with "cachekey"
  ```

- **EXPIRE**: Sets an expiration time for an existing key. This can be used to update the TTL of cached data.

  ```bash
  EXPIRE cachekey 600   # Set or update the expiration time of "cachekey" to 600 seconds
  ```

- **TTL**: Returns the remaining time to live (TTL) of a key. This helps monitor the validity period of cached items.

  ```bash
  TTL cachekey   # Get the remaining TTL of "cachekey"
  ```

- **CACHE MISS HANDLING**: When a cache miss occurs (i.e., the requested data is not in the cache), fetch the data from the primary data source, store it in Redis, and return it to the user.

  ```javascript
  // Example in JavaScript
  async function getData(key) {
    let value = await redis.get(key);
    if (value === null) {
      value = fetchFromPrimarySource(key);  // Fetch data from the database or another source
      await redis.set(key, value, 'EX', 3600); // Cache data with an expiration of 1 hour
    }
    return value;
  }
  ```

Redis caching is effective for reducing database load and speeding up data retrieval, especially for data that is frequently accessed or computationally expensive to generate. Proper cache management and expiration policies are crucial for maintaining cache effectiveness and consistency.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Session Management with Redis

Redis is often used for managing user sessions due to its speed and support for various data structures. It provides a way to store session data efficiently and handle session expiration.

- **SETEX**: Sets a session key with an expiration time. This is useful for creating or updating a session with a TTL.

  ```bash
  SETEX session:user123 3600 "session data"   # Set session data with a TTL of 1 hour (3600 seconds)
  ```

- **GET**: Retrieves the session data associated with a session key. If the session has expired or does not exist, it returns nil.

  ```bash
  GET session:user123   # Retrieve the session data for "session:user123"
  ```

- **DEL**: Deletes a session key. This can be used to manually end a session or clear expired sessions.

  ```bash
  DEL session:user123   # Delete the session data for "session:user123"
  ```

- **EXPIRE**: Sets or updates the expiration time for an existing session key. Useful for extending the session TTL.

  ```bash
  EXPIRE session:user123 1800   # Set or update the expiration time of "session:user123" to 30 minutes (1800 seconds)
  ```

- **SESSION MANAGEMENT IN APPLICATION**: Integrate Redis session management in your application for handling user sessions. Use middleware for automatic session handling in web frameworks.

  ```javascript
  // Example using express-session with Redis in Node.js
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const redisClient = require('redis').createClient();

  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 3600000 } // Cookie expires in 1 hour
  }));
  ```

Redis's session management capabilities offer efficient storage and retrieval of session data, with built-in support for expiration and easy integration into various application frameworks. This ensures that user sessions are handled quickly and securely.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Delivery Service with Geospatial Data

Redis supports geospatial indexing and querying through its geospatial data structures. This feature is particularly useful for applications involving location-based services, such as delivery tracking and location-based searches.

- **GEOADD**: Adds a geospatial item (e.g., a delivery location) to a Redis geospatial index. Each item is associated with a longitude and latitude.

  ```bash
  GEOADD deliveries 13.361389 38.1157 "LocationA"   # Add a location with longitude 13.361389 and latitude 38.1157
  ```

- **GEOPOS**: Retrieves the longitude and latitude of a geospatial item by its name.

  ```bash
  GEOPOS deliveries "LocationA"   # Get the coordinates of "LocationA"
  ```

- **GEODIST**: Calculates the distance between two geospatial items. The distance can be returned in meters, kilometers, miles, or feet.

  ```bash
  GEODIST deliveries "LocationA" "LocationB" km   # Get the distance between "LocationA" and "LocationB" in kilometers
  ```

- **GEORADIUS**: Finds all items within a specified radius of a given point. This is useful for searching nearby delivery locations.

  ```bash
  GEORADIUS deliveries 13.361389 38.1157 10 km   # Get all locations within 10 kilometers of the point (13.361389, 38.1157)
  ```

- **GEORADIUSBYMEMBER**: Finds all items within a specified radius of a given member. This can be used to find nearby locations relative to an existing delivery point.

  ```bash
  GEORADIUSBYMEMBER deliveries "LocationA" 10 km   # Get all locations within 10 kilometers of "LocationA"
  ```

- **GEOSEARCH**: Searches for items within a specified area using a bounding box or circle. This command is available in Redis versions 6.2 and later.

  ```bash
  GEOSEARCH deliveries FROMSPHERE 13.361389 38.1157 10 km   # Search for locations within a 10 km radius from the point (13.361389, 38.1157)
  ```

Redis's geospatial capabilities make it ideal for location-based services, allowing efficient querying and management of delivery locations and proximity searches.
know if you’re ready to proceed to the next sub-paragraph or if there are any changes needed!

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Time-Dependent Attempt Limits

Redis can be used to implement time-dependent limits on actions, such as login attempts or API requests. This can help prevent abuse and ensure fair usage by tracking and limiting the number of attempts within a given time frame.

- **INCR**: Increments the value of a key, useful for tracking the number of attempts. If the key does not exist, it is created with an initial value of 1.

  ```bash
  INCR attempt:user123   # Increment the count of attempts for user "user123"
  ```

- **EXPIRE**: Sets an expiration time for a key. This can be used in conjunction with `INCR` to limit the number of attempts within a specific time frame.

  ```bash
  EXPIRE attempt:user123 3600   # Set the TTL of the attempt counter for "user123" to 1 hour (3600 seconds)
  ```

- **GET**: Retrieves the current value of the attempt counter. This helps to check the number of attempts made.

  ```bash
  GET attempt:user123   # Get the number of attempts made by user "user123"
  ```

- **SETEX**: Sets a key with a value and expiration time in one command. This is useful for initializing an attempt counter with a TTL.

  ```bash
  SETEX attempt:user123 3600 1   # Initialize the attempt counter for "user123" with a value of 1 and TTL of 1 hour
  ```

- **DECR**: Decrements the value of a key. This can be used to decrease the count if attempts need to be adjusted.

  ```bash
  DECR attempt:user123   # Decrease the count of attempts for "user123"
  ```

- **LIMIT CHECK**: Implement logic in your application to enforce limits based on the counter values. For example, if the number of attempts exceeds a threshold, block further attempts.

  ```javascript
  // Example in JavaScript
  async function checkAttemptLimit(userId) {
    const attempts = await redis.get(`attempt:${userId}`);
    if (attempts && parseInt(attempts) > 5) {
      return 'Too many attempts. Please try again later.';
    }
    await redis.incr(`attempt:${userId}`);
    await redis.expire(`attempt:${userId}`, 3600); // Set TTL of 1 hour
    return 'Attempt allowed.';
  }
  ```

Redis's time-dependent attempt limits can effectively manage and control user actions, ensuring that usage policies are enforced and abuse is minimized.


[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Daily Quota Management

Redis can be used to manage daily quotas for various operations, such as API requests or resource usage. This allows you to enforce limits and track usage over a 24-hour period.

- **INCR**: Increments the quota counter for a specific user or operation. This tracks the number of operations or requests made within the day.

  ```bash
  INCR quota:user123   # Increment the daily quota counter for "user123"
  ```

- **SETEX**: Initializes the quota counter with an expiration time of 24 hours. This ensures that the quota resets daily.

  ```bash
  SETEX quota:user123 86400 1   # Set the initial daily quota counter for "user123" with TTL of 24 hours (86400 seconds)
  ```

- **GET**: Retrieves the current value of the daily quota counter. This helps to check the remaining quota for a user or operation.

  ```bash
  GET quota:user123   # Get the current daily quota value for "user123"
  ```

- **EXPIRE**: Updates the expiration time of the quota counter to ensure it resets at the end of the day.

  ```bash
  EXPIRE quota:user123 86400   # Set or update the TTL of the daily quota counter for "user123" to 24 hours
  ```

- **QUOTA CHECK**: Implement logic in your application to check the quota before allowing further operations. If the quota is exceeded, deny additional requests.

  ```javascript
  // Example in JavaScript
  async function checkDailyQuota(userId) {
    const quota = await redis.get(`quota:${userId}`);
    if (quota && parseInt(quota) > 100) { // Assuming a daily limit of 100 requests
      return 'Daily quota exceeded. Please try again tomorrow.';
    }
    await redis.incr(`quota:${userId}`);
    await redis.expire(`quota:${userId}`, 86400); // Set TTL to 24 hours
    return 'Request allowed.';
  }
  ```

Redis's daily quota management capabilities help enforce usage limits and ensure that resources are distributed fairly throughout the day.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Ranking Items

Redis supports ranking items through sorted sets, which are useful for maintaining and querying ranked lists such as leaderboards or top-performing items.

- **ZADD**: Adds an item to a sorted set with a given score. This score determines the rank of the item within the set.

  ```bash
  ZADD leaderboard 1500 "user1"   # Add "user1" to the sorted set "leaderboard" with a score of 1500
  ```

- **ZRANGE**: Retrieves items from the sorted set within a specified range, based on their scores. This is useful for getting the top N items.

  ```bash
  ZRANGE leaderboard 0 9 WITHSCORES   # Get the top 10 items (rank 1 to 10) from "leaderboard" with scores
  ```

- **ZRANK**: Gets the rank of an item in the sorted set. The rank is zero-based, meaning the highest score has rank 0.

  ```bash
  ZRANK leaderboard "user1"   # Get the rank of "user1" in the "leaderboard" sorted set
  ```

- **ZREVRANGE**: Retrieves items from the sorted set in reverse order, allowing you to get the highest scoring items first.

  ```bash
  ZREVRANGE leaderboard 0 9 WITHSCORES   # Get the top 10 items (highest scores first) from "leaderboard" with scores
  ```

- **ZINCRBY**: Increments the score of an existing item in the sorted set. This is useful for updating rankings, such as increasing a user’s score.

  ```bash
  ZINCRBY leaderboard 100 "user1"   # Increment the score of "user1" in "leaderboard" by 100
  ```

- **ZREM**: Removes an item from the sorted set. This can be used to delete outdated or irrelevant items from the ranking.

  ```bash
  ZREM leaderboard "user1"   # Remove "user1" from the "leaderboard" sorted set
  ```

Redis's sorted sets offer an efficient way to maintain and query ranked lists, making them ideal for applications that require real-time ranking and leaderboard functionality.


Here’s the content for the **Calculating Average Ratings** sub-paragraph:

```markdown
### Calculating Average Ratings

Redis can be used to calculate average ratings or scores for items by leveraging sorted sets and other data structures. This approach allows for efficient aggregation and computation of averages.

- **ZADD**: Adds rating scores to a sorted set. The score represents the rating given by users.

  ```bash
  ZADD ratings:item123 4.5 "user1"   # Add a rating of 4.5 for "item123" given by "user1"
  ZADD ratings:item123 3.7 "user2"   # Add another rating of 3.7 for "item123" given by "user2"
  ```

- **ZRANGE**: Retrieves all ratings for an item, which can then be used to calculate the average.

  ```bash
  ZRANGE ratings:item123 0 -1 WITHSCORES   # Get all ratings for "item123" with their scores
  ```

- **ZCARD**: Gets the number of ratings in the sorted set. This is used to determine the number of ratings for averaging.

  ```bash
  ZCARD ratings:item123   # Get the number of ratings for "item123"
  ```

- **AVG RATING CALCULATION**: Compute the average rating by summing all ratings and dividing by the number of ratings. This computation is performed in your application logic.

  ```javascript
  // Example in JavaScript
  async function calculateAverageRating(itemId) {
    const ratings = await redis.zrange(`ratings:${itemId}`, 0, -1, 'WITHSCORES');
    const totalRatings = ratings.length / 2;
    const sum = ratings.reduce((acc, _, i) => i % 2 === 1 ? acc + parseFloat(ratings[i]) : acc, 0);
    return totalRatings > 0 ? (sum / totalRatings).toFixed(2) : 'No ratings available.';
  }

Redis's sorted sets and related commands provide a foundation for calculating average ratings efficiently, allowing for real-time updates and aggregation of scores.

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Real-Time Rating Updates

Redis can be used to update and manage ratings in real-time, ensuring that rating data is current and reflects the latest user inputs. This is particularly useful for applications with dynamic content where ratings need to be updated and displayed immediately.

- **ZADD**: Adds or updates a rating in the sorted set. If the item already exists, the score is updated; otherwise, a new entry is created.

  ```bash
  ZADD ratings:item123 4.9 "user3"   # Update the rating of "item123" to 4.9 given by "user3"
  ```

- **ZINCRBY**: Increments the rating score for an existing item. This is useful if you want to adjust a rating by a certain amount.

  ```bash
  ZINCRBY ratings:item123 0.5 "user3"   # Increment the rating score of "item123" by 0.5 for "user3"
  ```

- **ZREVRANGE**: Retrieves the highest-rated items in real-time. This can be used to display top-rated items or provide live updates on ranking.

  ```bash
  ZREVRANGE ratings 0 9 WITHSCORES   # Get the top 10 rated items from the "ratings" sorted set, with scores
  ```

- **ZREM**: Removes a rating from the sorted set. This can be used to handle the removal of a rating or to clean up outdated data.

  ```bash
  ZREM ratings:item123 "user3"   # Remove the rating for "item123" given by "user3"
  ```

- **REAL-TIME UPDATES IN APPLICATION**: Implement logic in your application to handle real-time updates and display the latest rating information.

  ```javascript
  // Example in JavaScript
  async function updateRating(itemId, userId, newRating) {
    await redis.zadd(`ratings:${itemId}`, newRating, userId);
    return `Rating updated to ${newRating} for ${itemId}`;
  }
  ```

Redis's capabilities for real-time rating updates ensure that your application can provide up-to-date rating information and maintain accurate rankings as user interactions occur.


[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Site Visits Metadata

Redis can be used to track site visits metadata, including both unique and non-unique visits. This allows for detailed analytics and monitoring of user interactions.

- **Tracking Non-Unique Visits**: Use simple counters to track the total number of visits to a site or page.

  ```bash
  INCR site:homepage:visits   # Increment the total visit count for the homepage
  ```

- **Tracking Unique Visits**: Use HyperLogLog to track unique visits, providing an estimate of distinct visitors.

  ```bash
  PFADD unique_visits:homepage 192.168.1.1   # Add the IP address to the HyperLogLog for unique visits
  ```

- **IP Metadata**: Include IP addresses or other metadata with each visit to enrich visit records and analyze user behavior.

  ```bash
  HINCRBY site:metadata:homepage unique_visits 1   # Increment the unique visit count for the homepage
  ```

- **GET**: Retrieves the total visit count for a specific page or site. This shows the number of non-unique visits.

  ```bash
  GET site:homepage:visits   # Get the total visit count for the homepage
  ```

- **PFCOUNT**: Retrieves the estimated number of unique visits from the HyperLogLog.

  ```bash
  PFCOUNT unique_visits:homepage   # Get the estimated number of unique visits for the homepage
  ```

- **SITE VISITS ANALYTICS**: Implement logic in your application to record and analyze site visits, including both unique and non-unique visits.

  ```javascript
  // Example in JavaScript
  async function recordVisit(page, ipAddress) {
    await redis.incr(`site:${page}:visits`);
    await redis.pfadd(`unique_visits:${page}`, ipAddress);
    return `Visit recorded for ${page}`;
  }

  async function getVisitStats(page) {
    const totalVisits = await redis.get(`site:${page}:visits`);
    const uniqueVisits = await redis.pfcount(`unique_visits:${page}`);
    return {
      totalVisits,
      uniqueVisits
    };
  }
  ```

Redis’s combination of counters and HyperLogLog enables detailed tracking of site visits, distinguishing between unique and total visits, and providing valuable insights into user 

[Back To  Redis Overview Navigation](#redis-overview-navigation)


### Site Scrolling Metadata

Redis can be used to track and analyze site scrolling behavior, capturing data on how far users scroll on a page. This helps in understanding user engagement and content interaction. Additionally, users can be categorized based on their scrolling depth to tailor content or marketing strategies.

- **Tracking Scroll Depth**: Use Redis hashes to record and update scroll depth data for each user or page.

  ```bash
  HSET scroll_depth:homepage user123 80   # Set the scroll depth (in percentage) for "user123" on the homepage
  ```

- **HINCRBY**: Increment scroll depth data if tracking incremental scroll events.

  ```bash
  HINCRBY scroll_depth:homepage user123 20   # Increment the scroll depth by 20% for "user123" on the homepage
  ```

- **GET**: Retrieve the scroll depth for a specific user on a page.

  ```bash
  HGET scroll_depth:homepage user123   # Get the scroll depth for "user123" on the homepage
  ```

- **ZADD**: Use sorted sets to rank users based on their scroll depth or engagement level.

  ```bash
  ZADD scroll_engagement 80 "user123"   # Add "user123" to the sorted set with a score representing scroll depth
  ```

- **ZRANGE**: Retrieve the top users based on scroll engagement.

  ```bash
  ZRANGE scroll_engagement 0 9 WITHSCORES   # Get the top 10 users based on scroll engagement
  ```

- **Categorizing Users Based on Scroll Depth**:
  - Define categories based on scroll depth ranges, such as "Low Engagement", "Medium Engagement", and "High Engagement".
  - Use Redis hashes to set and retrieve user categories.

  ```bash
  HSET user_categories:user123 category "High Engagement"   # Set category for "user123" based on their scroll depth
  ```

  ```bash
  HGET user_categories:user123   # Retrieve the category for "user123"
  ```

- **SCROLL ANALYTICS**: Implement logic in your application to record scroll depth, categorize users, and analyze their engagement.

  ```javascript
  // Example in JavaScript
  async function recordScrollDepth(page, userId, depth) {
    await redis.hset(`scroll_depth:${page}`, userId, depth);
    await redis.zadd('scroll_engagement', depth, userId);

    // Categorize user based on scroll depth
    let category;
    if (depth >= 75) category = 'High Engagement';
    else if (depth >= 25) category = 'Medium Engagement';
    else category = 'Low Engagement';

    await redis.hset(`user_categories:${userId}`, 'category', category);
    return `Scroll depth ${depth}% recorded for ${userId} on ${page}, categorized as ${category}`;
  }

  async function getScrollDepth(page, userId) {
    return await redis.hget(`scroll_depth:${page}`, userId);
  }

  async function getUserCategory(userId) {
    return await redis.hget(`user_categories:${userId}`, 'category');
  }
  ```

Redis’s capabilities allow for detailed tracking of user scrolling behavior, categorization based on engagement levels, and analysis of content interaction, enabling targeted strategies and insights into user behavior.


Here’s the content for the **Site Mouse Click Data Heatmaps** sub-paragraph, which has replaced the previous **Unique Visits Counting**:


[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Site Duration Metadata

Redis can be used to track and analyze the duration of user visits on a website. This data helps in understanding user engagement and the amount of time spent on specific pages or sections.

- **Tracking Session Duration**: Use Redis hashes to record and update the duration of user sessions on different pages.

  ```bash
  HSET session_duration:homepage user123 120   # Set the session duration (in seconds) for "user123" on the homepage
  ```

- **INCRBY**: Increment session duration data for ongoing user sessions.

  ```bash
  INCRBY session_duration:homepage:user123 30   # Increment the session duration by 30 seconds for "user123" on the homepage
  ```

- **GET**: Retrieve the total session duration for a specific user on a page.

  ```bash
  GET session_duration:homepage:user123   # Get the session duration for "user123" on the homepage
  ```

- **ZADD**: Use sorted sets to rank users based on their total session duration.

  ```bash
  ZADD session_engagement 120 "user123"   # Add "user123" to the sorted set with a score representing session duration
  ```

- **ZRANGE**: Retrieve the top users based on session duration.

  ```bash
  ZRANGE session_engagement 0 9 WITHSCORES   # Get the top 10 users based on session duration
  ```

- **DURATION ANALYTICS**: Implement logic in your application to record, analyze, and visualize user session durations for insights into engagement.

  ```javascript
  // Example in JavaScript
  async function recordSessionDuration(page, userId, duration) {
    await redis.hset(`session_duration:${page}`, userId, duration);
    await redis.zadd('session_engagement', duration, userId);
    return `Session duration ${duration} seconds recorded for ${userId} on ${page}`;
  }

  async function getSessionDuration(page, userId) {
    return await redis.hget(`session_duration:${page}`, userId);
  }

  async function getTopSessions() {
    return await redis.zrange('session_engagement', 0, -1, 'WITHSCORES');
  }
  ```

Redis’s data structures support tracking and analyzing site duration metadata, enabling detailed insights into user engagement and time spent on your site.

[Back To  Redis Overview Navigation](#redis-overview-navigation)

### Site Mouse Click Data Heatmaps

Redis can be used to generate heatmaps for mouse clicks on a website, providing insights into user interactions and popular areas on the page. This data helps in analyzing user behavior and improving website design.

- **Tracking Clicks**: Use Redis hashes to record and update click data at specific coordinates on a page.

  ```bash
  HINCRBY click_heatmap:homepage "x:100:y:200" 1   # Increment click count at coordinates (100, 200) on the homepage
  ```

- **GET**: Retrieve click data for specific coordinates to generate heatmaps.

  ```bash
  HGET click_heatmap:homepage "x:100:y:200"   # Get the number of clicks at coordinates (100, 200) on the homepage
  ```

- **ZADD**: Use sorted sets to rank areas based on the number of clicks.

  ```bash
  ZADD click_engagement 150 "x:100:y:200"   # Add coordinate to the sorted set with a score representing the number of clicks
  ```

- **ZRANGE**: Retrieve the most clicked areas based on engagement data.

  ```bash
  ZRANGE click_engagement 0 9 WITHSCORES   # Get the top 10 clicked areas based on the number of clicks
  ```

- **ANALYZE CLICK DATA**: Implement logic in your application to record, retrieve, and analyze click data to create visual heatmaps and improve user experience.

  ```javascript
  // Example in JavaScript
  async function recordClick(page, x, y) {
    await redis.hincrby(`click_heatmap:${page}`, `x:${x}:y:${y}`, 1);
    await redis.zadd('click_engagement', 1, `x:${x}:y:${y}`);
    return `Click recorded at (${x}, ${y}) on ${page}`;
  }

  async function getClickHeatmap(page) {
    return await redis.hgetall(`click_heatmap:${page}`);
  }

  async function getTopClickedAreas() {
    return await redis.zrange('click_engagement', 0, -1, 'WITHSCORES');
  }
  ```


[Back To  Redis Overview Navigation](#redis-overview-navigation)




Redis's efficient data structures allow for tracking and analyzing mouse click data, enabling the creation of heatmaps that visualize user interactions and enhance web design strategies.


</details>

