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
* Decouple the definition of the Express Server, `express server`, from the logic to define the MongoDB server, `mongo`;
* Write a helper module to define, but not start the `Cloud Application`;
* Write a helper pattern for how to set up and launch the `mongo` server;
* Write a helper pattern for how to set up and launch the `mongodb-memory-server`, server;
* Couple the `express server` server and `mongo` helper pattern into `index.ts`, to launch the `Cloud Application`;
* Couple the `express server` server and `mongodb-memory-server` into e2e tests, to validate RestFull APIs calls to operate on `application entities`;

This illustrations the approached suggested above:
![Alt text](./images/e2e-1.png)

#Sample Source
Below is a simplified view.

##Express Server
We use this module to launch the express server,  `Cloud Application`, and `e2e` tests;
````typescript
// expressServer.ts

import express from 'express';
const routes = require("./routes")

function createExpressServer() {
	const expressServer = express()
	expressServer.use(express.json())
	expressServer.use("/api", routes)
	server = http.createServer(expressServer);
	return expressServer
}

module.exports = createExpressServer
````
##MongoDB Pattern,  mongo
We pair this pattern with the `express server` module to launch the `Cloud Application`;
````typescript
const mongoose = require("mongoose")

mongoose
	.connect("mongodb://localhost:27017/acmedb", { useNewUrlParser: true })
	.then(() => {
		// express server initialization logic goes here, see Cloud Application
	})
````

##Cloud Application
This is a simple example of how to integrate the `mongo` pattern with the `express server` module to launch the `Cloud Application`:
````typescript
// index.ts
import express = from "express";
import mongoose from "mongoose";
const createExpressServer = require("./expressServer") // new

const uri: string = `mongodb+srv://systemAdmin:hUr9bvrr4AQiDJf@rms-mongo-cluster-chess.z4pdw.mongodb.net/swiss-pairing}`;
const options = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
const expressServerPort = 3000;
mongoose.set("useFindAndModify", false)
mongoose
	.connect(uri, options)
	.then(() => {
		console.log("Mongo Server has started!")
		const expressServer = createExpressServer() // new
		expressServer.listen(expressServerPort, () => {
			console.log("Express Server has started!")
		})
	})
````

##mongodb-memory-server patterns
We use this pattern to configure and launch the `mongodb-memory-server`:
````typescript

// *************************************************
// mongodb-memory-server import pattern
// *************************************************
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from '../index';
import mongoose from "mongoose";

// This is an Example test, do not merge it with others and do not delete this file
describe('Single MongoMemoryServer', () => {
	// *************************************************
	// mongodb-memory-server sescribe pattern
    // *************************************************
	let mongo = new MongoMemoryServer();
	let mongoURI;
	const options: any = {
		useNewUrlParser: true,
		useUnifiedTopoloty: true
	}
	const app: Express.Application;
	
	beforeAll(async done => {
		// mongodb-memory-server beforeAll pattern
		mongoURI = await mongo.GetUri();
		await mongoose.connect(mongoURI, options);
		done();
	});

	// tests clauses, not shown here

	afterAll(async done => {
		// *************************************************
		// mongodb-memory-server afterAll pattern
		// *************************************************
		await mongo.stop();
		await mongoose.connection.close();
		done();
	})
})
````

##E2e Test
This is a simple example of how to integrate the `mongodb-memory-server` pattern with the `express server` module to launch `e2e` tests:
````typescript
// e2e.test.ts

// *************************************************
// mongodb-memory-server import pattern
// *************************************************
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from '../index';
const mongoose = require("mongoose")
const createExpressServer = require("./expressServer") // new


describe("Canonical Tests", () => {
	// mongodb-pattern describe preamble
	beforeAll(async done => {
		const expressServer = createExpressServer()
		// mongodb-memory-server beforeAll pattern
	});
	
    it(`returns 201 on sucessfull signup`, async done => {
        const user = {
            firstName: "Marco",
            lastName: "Maciel",
            email: "Marco.Maciel@yahoo.com",
            password: "CuXK3mv^10c2"
        };
        await supertest(expressServer)
            .post("/user")
            .expect(201)
            .then((response) => {
                // Check the response type and length
                expect(Array.isArray(response.body)).toBeFalsy()
                 
                // Check the response data
                expect(response.body.firstName).toBe(user.firstName);
                expect(response.body.lastName).toBe(user.lastName);
                expect(response.body.email).toBe(user.email);
            });
        done();
	});
    
	afterAll(async done => {
		// mongodb-memory-server afterAll pattern
	})
});
````