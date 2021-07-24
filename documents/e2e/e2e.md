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
* Decouple the definition of the Express Server, `express server`, Http Server, `http server`, from the logic to define the MongoDB server, `mongo`;
* Write a helper module to define, but not start the `express application`;
* Write a helper module to define, but not start the `http server`;
* Write a helper module to define and start the`mongo` server;
* Write a helper module to define and start the`mongodb-memory-server` server;
* Refactor `index.ts` to aggregate the `express server`, `http server`, and `mongo`;
* Refactor `e2e teasts` to aggregate the `express server`, `http server`, and `mongodb-memory-server`;

This illustrations the approached suggested above:
![Alt text](./images/e2e-1.png)

#Sample Source
Below is a simplified view.

##Express Application
We use this module to create the express application,  aggregated to the `Cloud Application`, and `e2e` tests;
````typescript
// server.ts

// import statements

export const createExpressApp = (): express.Application => {
    // app.use configurations

    // app routes 
    
    // Helper routes
    // Route to ensure the express server is working properly
    app.get('/hello', (req: express.Request, res: express.Response) => {
        res.status(200).send(`Express Server up and running!`)
    });

    // Route to quit the express server
    app.get('/quit', (req: express.Request, res: express.Response) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close()
                .then()
                .catch((error: any) => {})
        });
        res.status(200).send(`Express Server terminated!`);
        process.exit(0)
    });

    return app;
}
````

##Http Server
We use this module to create the express application,  aggregated to the `Cloud Application`, and `e2e` tests;
````typescript
// server.ts

// import statements

export const createHttpServer = (expressApplication: express.Application): http.Server => {
    return http.createServer(expressApplication);
}

````

##MongoDB Atlas
We use this module to configure and launch the MongoDB Atlas, aggregated to `Cloud Application`;
````typescript
// server.ts

// import statements

// Configuration
import {IConfig} from "../config/config.interface";
let config: IConfig = require('../config/config.dev.json');

export const mongoDbAtlas = (expressApplication: express.Application): void => {
    const httpServer: http.Server = createHttpServer(expressApplication);
    mongoose.set("useFindAndModify", false)
    mongoose
        .connect(config.mongoDbAtlasURI, mongoOptions)
        .then(() => {
            console.log(`MongoDB Atlas server running: ` + config.mongoDbAtlasURI);
            httpServer.listen(config.expressServerPort, () => {
                console.log(`Express Server running at http://localhost:${config.expressServerPort}`);
            });
        })
        .catch(error => {
            console.log(`Unable to connect to MongoDB Atlas server ` + JSON.stringify(error));
            throw error
        })
}

````

##MongoDB In Memory
We use this module to configure and launch the MongoDB Atlas, aggregated to `e2e tests`;
````typescript
// server.ts

// import statements

// Configuration
import {IConfig} from "../config/config.interface";
let config: IConfig = require('../config/config.dev.json');

export const mongoDbInMemory = (expressApplication: express.Application): void => {
    process.env.JWT_KEY = "abc";
    const httpServer: http.Server = createHttpServer(expressApplication);
    let mongoMemoryServer = new MongoMemoryServer();
    mongoMemoryServer.getUri()
        .then((mongoMemoryServerURI: string) => {
            mongoose
                .connect(mongoMemoryServerURI, mongoOptions)
                .then(() => {
                    console.log(`MongoDB In Memory server running: ` + mongoMemoryServerURI);
                    httpServer.listen(config.expressServerPort, () => {
                        console.log("Express Server has started!")
                    })
                })
        })
}


````

##Cloud Application
This is a simple example of how to aggregate the `express application`, `http server`, and the `mongodb atlas` to launch the `Cloud Application`
````typescript
// index.ts

// import statements

// Aggregate the express application
const app: express.Application = createExpressApp();

// Aggregate the http server
const server: http.Server = createHttpServer(app);

// Aggregate the MongoDB Atlas server
mongoDbAtlas(app);

export default app;
export { server }
````

##E2e Test
This is a simple example of how to aggregate the `express application`, `http server`, and the `mongodb im memory` to launch `e2e tests`
````typescript

// *************************************************
// mongodb-memory-server import pattern
// *************************************************
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
    let expressApplication: express.Application;
    let httpServer: http.Server;

    beforeAll(async (done) => {
        expressApplication = createExpressApp();
        httpServer = createHttpServer(expressApplication);
        mongoDbInMemory(expressApplication);
        done()
    })

	// tests clauses, not shown here

    afterAll(async (done) => {
        response = await request(httpServer)
            .get('/quit')
            .expect(200)
             .then(response => {
                console.log("\nindex/response :" + JSON.stringify(response) + '\n');
                expect(response.text).toEqual('Express Server terminated!');
                done()
            })
            .catch(err => done(err))
    })
})
````