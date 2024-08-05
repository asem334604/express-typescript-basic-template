
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

