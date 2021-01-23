# chess-tournament-swiss
A service to manage a chess tournament using the Swiss pairing method

# Heroku
## 
TBD

## Build status
TBD
# Introduction
This is a playground to implement a service to manager a chess tournament using Swiss Pairing, just because I'm curious. I will keep the technology stack as simple as possible using Node.js / Express / Typescript stack, which I'm familiar with. I'll experiment with one technology components, Cucumber, because I'm interested in learning about Live Documentation. 

## Swiss Pairing
Swiss Pairing is a method of pairing players in a tournament, requiring a relatively small number of rounds, involving all tournament players, to determine the winner(s); it was used for the first time in Switzerland in 1895, and today tournament organizers use it primarily for chess tournaments. The Swiss Paring method addresses significant problems of round robin and single elimination tournaments:
* _Round robin_ tournaments require as many rounds as the number of players minus 1. Since most 2-hours / game tournaments take place over a weekend, limiting the number of rounds to 6, and the field to six players. Swiss pairing limits the number of rounds to log base 2 of the number of players, enabling up to 32 players to context a 2-hours/game weekend chess tournament.
* _Single elimination_ tournaments leave half the field with nothing to do after the first round. Each successive round eliminates half the field, leaving these players with nothing to do. Swiss pairing is one way to provide pairings for all players in all rounds.

## Swiss Pairing Rules
The [FIDE](https://handbook.fide.com/chapter/C0401#:~:text=The%20following%20rules%20are%20valid%20for%20each%20Swiss,received%20a%20...%20%207%20more%20rows) basic rules are:
1. The number of rounds to be played is declared beforehand.
1. Two players shall not play against each other more than once.
1. Should the number of players to be paired be odd, one player is unpaired. This player receives a pairing-allocated bye: no opponent, no colour and as many points as are rewarded for a win, unless the rules of the tournament state otherwise.
1. A player who has already received a pairing-allocated bye, or has already scored a (forfeit) win due to an opponent not appearing in time, shall not receive the pairing-allocated bye.
1. In general, players are paired to others with the same score.
1. For each player the difference between the number of black and the number of white games shall not be greater than 2 or less than –2.
1. Each system may have exceptions to this rule in the last round of a tournament.
1. No player shall receive the same colour three times in a row.
1. Each system may have exceptions to this rule in the last round of a tournament.
1. Colour balancing
    1. In general, a player is given the colour with which he played less games.
    1. If colours are already balanced, then, in general, the player is given the colour that alternates from the last one with which he played.
1. The pairing rules must be such transparent that the person who is in charge for the pairing can explain them.

# 0.0.2 New Structure
I decided to refactor the work I did on round-swiss-pairing branch, starting from the point where the basic framework was in place. The new structure will be:
* rest
  * Player
  * Game
  * Tournament
  * Round
* model
  * Player
  * Game
  * Tournament
  * TournamentPlayer extends Player
  * Round: Array<Game>
  data
      DPlayer
      DGame
      DTournament
      DTournamentPlayer extends Player
      DRound: Array<Game>
  types
      IPlayer
      IGame
      ITournament
      ITournamentPlayer extends Player
      IRound: Array<Game>

# 0.0.1 Implemented the basic framework
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

