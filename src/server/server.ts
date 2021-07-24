import express from "express";
import * as bodyparser from "body-parser";
import cors from "cors";
import {CommonRoutesConfig} from "../common/common.routes.config";
import {UserRoutes} from "../model/user/user.routes.config";
import {TournamentRoutes} from "../model/tournament/tournament.routes.config";
import {PlayerRoutes} from "../model/player/player.route.config";
import {GameRoutes} from "../model/game/game.routes.config";
import {RoundRoutes} from "../model/round/round.routes.config";
import http from "http";
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";
const mongoOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }

// Configuration
import {IConfig} from "../config/config.interface";
let config: IConfig = require('../config/config.dev.json');

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
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close()
                .then()
                .catch((error: any) => {})
        });
        res.status(200).send(`Express Server terminated!`);
        process.exit(0)
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
 * Given and express application, it creates an http server for it
 * @param expressApplication
 */
export const createHttpServer = (expressApplication: express.Application): http.Server => {
    return http.createServer(expressApplication);
}

/**
 * mongoDbAtlas - initializes and starts the MongoDB Atlas service
 *
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
 * mongoDbInMemory - Initializes the in-memory MongoDB database
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
