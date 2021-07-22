#Introduction
I decided to add a robust `e2e` automated test capability as I transition from implementing the 'user' model to the other entities.

One of the challenges with `e2e` testing is to preserve the integrity of the `production` database; the standard approach is to execute `e2e` tests in an environment other than `production`, I refer to it as `staging`. This can be heavy and complicated since making copies of a production database can be expensive and production data might have to be masked; also, we  have to add logic to teach our application about whether we are in `e2e` test mode.

Looking for a lighter and more reliable `e2e` mechanism I learned about `in memory` databases designed specifically  for testing or mocking during development!

This document describes the approach I took to integrate the `mongodb-memory-serve` in-memory database in our `e2e` tests.

#Technology Stack
I chose the following:
* **Jest** - I'm already using it for unit tests; it is well suited for `e2e` tests as well;
* **Supertest**  - It is an excellent pairing with 'Jest', with many blogs describing how to integrate them;
* **mongodb-memory-server** - This is a new technology element; will speed up and simplify `e2e` testing; since it is not the same as `MongoDB Atlas`, where I host our database, I'll have to ensure to test the connection to it;

#Architecture
The recommended approach is:
* Decouple the definition of the Express server from the logic to define the MongoDB server;
* Write a helper module to define, but not start the `express` server;
* Write a helper module to define, but not start the `MongoDB` server;
* Write a helper pattern for how to set up the `mongodb-memory-server` server;
* Couple the `express` server with the `MongoDB` server to launch the `application`;
* Couple the `express` server with the `mongodb-memory-server` patterns to execute the `e2e` tests;

This illustrations the approached suggested above:
![Alt text](./images/e2e-1.png)

#Sample Source
Below is a simplified view.

##ExpressServer
````typescript
// expressServer.ts

const express = require("express")
const routes = require("./routes")

function createApp() {
	const app = express()
	app.use(express.json())
	app.use("/api", routes)
	server = http.createServer(app);
	return app
}

module.exports = createApp
````

##MongoServer
````typescript
// mongoServerCloud.ts

const mongoose = require("mongoose");
const app = require("./expressServer") // new
const server: http.Server = http.createServer(app);

const uri = `mongodb+srv://systemAdmin:hUr9bvrr4AQiDJf@rms-mongo-cluster-chess.z4pdw.mongodb.net/swiss-pairing`;
const options = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
mongoose.set("useFindAndModify", false)
mongoose
	.connect(uri, options)
	.then(() => {
		server.listen(port, () => {
			console.log(`Express Application and MongoCloud Server running`)
		});
	})
	.catch(error => {
		console.log(`Error logging in ` + JSON.stringify(error));
		throw error
	})

````
##mongodb-memory-server patterns
This is not a class, but a `pattern` to use in each test class.
````typescript

// *************************************************
// mongodb-memory-server import pattern
// *************************************************
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from '../index';
import { afterAll, beforeAll } from "@jest/globals";
const createServer = require("./server") // new

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
		app = createServer() // new
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

````typescript
// e2e.test.ts

// mongodb-memory-server import pattern
const mongoose = require("mongoose")
const createServer = require("./expressSserver")


describe("Canonical Tests", () => {
	// mongodb-pattern describe preamble
	beforeAll(async done => {
		// mongodb-memory-server beforeAll pattern
	});
	
    it(`returns 201 on sucessfull signup`, async done => {
        const user = {
            firstName: "Marco",
            lastName: "Maciel",
            email: "Marco.Maciel@yahoo.com",
            password: "CuXK3mv^10c2"
        };
        await supertest(app)
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