import express from "express";
import http from "http";
import {AMongoDb} from "./mongodb";
import * as bodyparser from "body-parser";
import cors from "cors";
import {CommonRoutesConfig} from "../common/common.routes.config";
import {UserRoutes} from "../model/user/user.routes.config";
import {TournamentRoutes} from "../model/tournament/tournament.routes.config";
import {PlayerRoutes} from "../model/player/player.route.config";
import {GameRoutes} from "../model/game/game.routes.config";
import {RoundRoutes} from "../model/round/round.routes.config";
import {ISwissPairingServers} from "./swiss-pairings-interface";

// Configuration
import {IConfig} from "../config/config.interface";
let config: IConfig = require('../config/config.dev.json');

export const launchServers = (mongodb: AMongoDb): ISwissPairingServers => {
	const app: express.Application = express();

	// here we add middleware to parse all incoming requests as JSON
	app.use(bodyparser.json());

	// here  we add middleware to allow cross-origin requests
	app.use(cors());

	// here we add middleware to parse all incoming requests as JSON
	app.use(bodyparser.json());

	// here we add the UserRoutes to our array, after sending the Express.js application object to have the routes added to
	// our app!
	const routes: Array<CommonRoutesConfig> = [];
	routes.push(new UserRoutes(app));
	routes.push(new TournamentRoutes(app));
	routes.push(new PlayerRoutes(app));
	routes.push(new GameRoutes(app));
	routes.push(new RoundRoutes(app));

	// start http server
	const httpServer: http.Server = http.createServer(app);

	// Connect database and start listening for http calls
	mongodb.connect()
		.then(() => {
			console.log(`MongoDB Server running`);
			httpServer.listen(config.expressServerPort, () => {
				console.log(`Express Server running at http://localhost:${config.expressServerPort}`);
				routes.forEach((route: CommonRoutesConfig) => {
					console.log(`Routes configured for ${route.getName()}`);
				});
			});
		})
		.catch((err: any) => {
			throw (err);
		})

	// Route to ensure the express server is working properly
	app.get('/hello', (req: express.Request, res: express.Response) => {
		res.status(200).send(`Swiss Pairing up and running!`)
	});

	// Route to quit the express server
	app.get('/quit', (req: express.Request, res: express.Response) => {
		res.status(200).send(`Swiss Pairing stopped!`)
		stopServers(mongodb, httpServer);
	});

	return {
		applicationServer: app,
		httpServer: httpServer
	};
}

export const stopServers = (mongodb: AMongoDb, httpServer: http.Server): void => {
	console.log('Received kill signal, shutting down gracefully');

	// Stop database
	mongodb.close()
		.then(() => {
			console.log('Closed database connection');
		})

	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	httpServer.close(() => {
		console.log('Closed httpServer and express connections');
		process.exit(0);
	});

	setTimeout(() => {
		console.error('Could not close connection in time, forcefully shutting down');
		process.exit(1);
	}, 10000);
}


