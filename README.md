# chess-tournament-swiss
A service to manage a chess tournament using the Swiss pairing method

# Heroku
## 
TBD

## Build status
TBD

# Implemented the basic framwork
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

