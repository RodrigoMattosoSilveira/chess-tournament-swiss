# chess-tournament-swiss
A service to manage a chess tournament using the Swiss pairing method

# Heroku
## 
TBD

## Build status
TBD

# Implemented the basic framework
Used [How to set up an Express.js API using Webpack and TypeScript](https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52) as a guideline;

## Improvement deviation
The document's _13. Improvement_ section contains a bug leading to a transpilation error:
````bash
$ yarn start:dev
yarn run v1.22.4
$ NODE_ENV=development webpack
[webpack-cli] TypeError: compiler.plugin is not a function
````

I fixed by replacing `webpack-shell-plugin` with `nodemon-webpack-plugin`.

## Unit Tests
Had to deal with a number of errors

### Missing ts-node
````bash
$ yarn test
yarn run v1.22.4
$ jest
Error: Jest: Failed to parse the TypeScript config file /Users/rodrigomattososilveira/projects/chess-tournament-swiss/jest.config.ts
  Error: Jest: 'ts-node' is required for the TypeScript configuration files. Make sure it is installed
````

All I had to do was to run `$ yarn add ts-node -D`

### Supertest is not typed
````
$ yarn test
yarn run v1.22.4
$ jest
 FAIL  tests/index.test.ts
  ● Test suite failed to run

    tests/index.test.ts:2:23 - error TS7016: Could not find a declaration file for module 'supertest'. '/Users/rodrigomattososilveira/projects/chess-tournament-swiss/node_modules/supertest/index.js' implicitly has an 'any' type.
````

All I had to do was to change supertest declaration:
````bash
// import * as supertest from 'supertest';
var supertest = require("supertest");
````

### Supertest is not typed

````bash
    tests/index.test.ts:4:6 - error TS7034: Variable 'request' implicitly has type 'any' in some locations where its type cannot be determined.

    4  let request;
           ~~~~~~~
    tests/index.test.ts:9:3 - error TS7005: Variable 'request' implicitly has an 'any' type.
````
All I had to do was to change request declaration:
````bash
//	let request;
	let request: any;
````

