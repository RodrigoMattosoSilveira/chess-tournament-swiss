import express from "express";
import http from "http";
import * as bodyparser from "body-parser";
import cors from "cors";

// Routes
import {CommonRoutesConfig} from "../common/common.routes.config";
import {UserRoutes} from "../model/user/user.routes.config";
import {TournamentRoutes} from "../model/tournament/tournament.routes.config";
import {PlayerRoutes} from "../model/player/player.route.config";
import {GameRoutes} from "../model/game/game.routes.config";
import {RoundRoutes} from "../model/round/round.routes.config";

// MongoDB
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";
const mongoOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }

// Configuration
import {IConfig} from "../config/config.interface";
let config: IConfig = require('../config/config.dev.json');
let httpServers: http.Server[] = [];

/** ********************************************************************************************************************
 * Express Application, Http Server
 ******************************************************************************************************************** */
export const createExpressApp = (): express.Application => {
    const app: express.Application = express();
    // here we add middleware to parse all incoming requests as JSON
    app.use(bodyparser.json());

    // here  we add middleware to allow cross-origin requests
    app.use(cors());

    // here we add middleware to parse all incoming requests as JSON
    app.use(bodyparser.json());

    // Route to ensure the express server is working properly
    app.get('/hello', (req: express.Request, res: express.Response) => {
        res.status(200).send(`Express Server up and running!`)
    });

    // Route to quit the express server
    app.get('/quit', (req: express.Request, res: express.Response) => {
        mongoAtlasShutDown();
        expressApplicationShutDown();
    });

    // here we add the UserRoutes to our array, after sending the Express.js application object to have the routes added to
    // our app!
    const routes: Array<CommonRoutesConfig> = [];
    routes.push(new UserRoutes(app));
    routes.push(new TournamentRoutes(app));
    routes.push(new PlayerRoutes(app));
    routes.push(new GameRoutes(app));
    routes.push(new RoundRoutes(app));

    return app;
}

/**
 * Creates an http server for a given express application.
 * @param expressApplication
 */
export const createHttpServer = (expressApplication: express.Application): http.Server => {
    const httpServer: http.Server = http.createServer(expressApplication);
    httpServers.push(httpServer);
    return httpServer;
}

/**
 * Shuts down all http servers
 */
export const expressApplicationShutDown = (): void => {
    console.log('Received kill signal, shutting down gracefully');
    httpServers.forEach((httpServer: http.Server) => {
        httpServer.close(() => {
            console.log('Closed httpServer connection');
            process.exit(0);
        });

        setTimeout(() => {
            console.error('Could not close connection in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    })
}

/** ********************************************************************************************************************
 * Mongo Atlas and in memory
 ******************************************************************************************************************** */

/**
 * Initializes and starts the MongoDB Atlas service
 */
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

/**
 * Initializes the in-memory MongoDB database
 */
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

/**
 * Shut down the MongoDB Atlas service connection
 */
export const mongoAtlasShutDown = (): void => {
    mongoose.connection.close()
        .then(() => {console.log(`Close MongoAlas connection`)})
        .catch((err: any) => {console.log(`Unable to close MongoAlas connection`)})
}

/**
 * Shut down the MongoDB in memory service connection
 */
export const mongoInMemoryShutDown = (): void => {
    mongoose.connection.db.dropDatabase(() => {
        console.log(`Dropped the database`);
        mongoose.connection.close()
            .then( () => {console.log(`Closed mongoose connection`);})
            .catch((error: any) => {})
    });
};
