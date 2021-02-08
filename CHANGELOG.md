# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
## [0.0.8] - underway
### Feature
* Modeling a tournament player

## [0.0.7] - 2021 02 07
### Feature
* Added the user and tournament tests

## [0.0.6] - 2021 02 04
### Feature
* Improve testing

## [0.0.5] - 2021 01 30
### Feature
* Added the tournament entity

## [0.0.4] - 2021 01 30
### Feature
* Added testing to the user entity

## [0.0.3] - 2021 01 30
### Feature
* Integrate DAO DTO layers using new entity, user (no testing)

## [0.0.2] - 2021 01 30
### Feature
* Create infrastructure / Node / Express / Typescript
* Added one entity, player

## [0.0.1] - 2021 01 17
### Feature
* Create Documents

# Outstanding Tasks
## Short term
1. ~~Create documents~~
1. ~~Create infrastructure / Node / Express / Typescript~~
1. Add Swiss pairing method to pair next round using hard coded data

## Long term
1. Add MongoDB
1. Implement ~~Angular~~ / Node / Express / MongoDB boilerplate backend
1. Add support for the backend hot reload
1. Transform boilerplate into chess tournament, using curl, supporting
   1. Hard Code tournament players (JSON Object);
   1. List of players enrolled on a tournament;
   1. Use the Swiss Pairing Method to pair player for each round (This is the heart of Milestone #1);
   1. Display tournament round pairings;
   1. Hard code tournament round games’ results (JSON Object) ;
   1. Display tournament standing;
1. Add Angular Workspace framework
1. Implement Angular ~~/ Node / Express / MongoDB~~ boilerplate frontend 
1. Expand Backend
   1. CRUD a community, and list all communities;
   1. CRUD a community member, and list all community members;
   1. CRUD a community tournament (default is open for enrolment), and list all community tournaments;
   1. Enroll a player on a tournament;
   1. Close tournament enrollment;
   1. List of players enrolled on a tournament;
   1. Use the Swiss Pairing Method to pair player for each round;
   1. Display tournament round pairings;
   1. Record tournament round games’ results;
   1. Display tournament standing;
1. Expand Frontend
   1. Add a UX to add community membership (administrator, tournament director, player)
   1. Add a UX for a tournament director, TD, to create a tournament;
   1. Add a UX for a player sign up a tournament;
   1. Add a UX for a TD to close tournament for new players;
   1. Add a UX for a user to read tournament players;
   1. Add a UX for a TD to pair players for the next round;
   1. Add a UX for a user to see the next round pairings;
   1. Add a UX for a user to record a current round result;
   1. Add a UX for a user to read current round results;
   1. Add a UX for a TD to close the current round;
   1. Add a UX for a user to read current tournament standings;'
