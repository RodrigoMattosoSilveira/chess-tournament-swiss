#Introduction
I decided to add a robust `e2e` automated test capability as I transition from implementing the 'user' model to the other entities.

One of the challenges with `e2e` testing is to preserve the integrity of the `production` database; the standard approach is to execute `e2e` tests in an environment other than `production`, I refer to it as `staging`. This can be heavy and complicated since making copies of a production database can be expensive and production data might have to be masked; also, we  have to add logic to teach our application about whether we are in `e2e` test mode.

Looking for a lighter and more reliable `e2e` mechanism I learned about `in memory` databases designed specifically  for testing or mocking during development!

This document describes the approach I took to integrate the `mongodb-memory-serve` in-memory database in our `e2e` tests.

#Technology Stack
I chose the following:
* **[MongoDB](https://www.mongodb.com/)** The document database used by the cloud application;
* **[mongoose](https://www.npmjs.com/package/mongoose)** A MongoDB object modeling for NodeJS;
* **[mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server)** - This is a new technology element; will speed up and simplify `e2e` testing; since it is not the same as `MongoDB Atlas`, where I host our database, I'll have to ensure to test the connection to it;
* **[Jest](https://jestjs.io/)** - I'm already using it for unit tests; it is well suited for `e2e` tests as well;
* **[Supertest](https://www.npmjs.com/package/supertest)**  - It is an excellent pairing with 'Jest', with many blogs describing how to integrate them;

#Architecture
The recommended approach is:
* Write decoupled servers: Express Server, `express server`, Http Server; `http server`; Mongo server, `mongo`;
* Write production and test Mongo servers: MongoDB Atlas, `mongoAtlas`; MongoDb In Memory server, `mongoInMem`;
* Refactor `index.ts` to aggregate the `express server`, `http server`, and `mongoAtlas`;
* Refactor `e2e teasts` to aggregate the `express server`, `http server`, and `mongoInMem`;

This illustrations the approached suggested above:
![Alt text](./images/e2e-1.png)

#Sample Source
See the `./server/` folder for the implementations
