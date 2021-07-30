import express from "express";
import * as bodyparser from "body-parser";
import cors from "cors";
import * as winston from 'winston';
import * as expressWinston from 'express-winston';

import {CommonRoutesConfig} from "../common/common.routes.config";
import {UserRoutes} from "../model/user/user.routes.config";
import {TournamentRoutes} from "../model/tournament/tournament.routes.config";
import {PlayerRoutes} from "../model/player/player.route.config";
import {GameRoutes} from "../model/game/game.routes.config";
import {RoundRoutes} from "../model/round/round.routes.config";

const app = express();

// here we add middleware to parse all incoming requests as JSON
app.use(bodyparser.json());

// here  we add middleware to allow cross-origin requests
app.use(cors());

// here we add middleware to parse all incoming requests as JSON
app.use(bodyparser.json());

app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console()
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.json()
	)
}));


// here we add the UserRoutes to our array, after sending the Express.js application object to have the routes added to
// our app!
const routes: Array<CommonRoutesConfig> = [];
routes.push(new UserRoutes(app));
routes.push(new TournamentRoutes(app));
routes.push(new PlayerRoutes(app));
routes.push(new GameRoutes(app));
routes.push(new RoundRoutes(app));

// Route to ensure the express server is working properly
app.get('/hello', (req:express.Request, res: express.Response) => {
	res.status(200).send(`Swiss Pairing up and running!`)
});

// Route to quit the express server
app.get('/quit', (req: express.Request, res: express.Response) => {
	res.status(200).send(`Swiss Pairing stopped!`)

	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	console.log('Closed httpServer and express connections');
	process.exit(0);

	setTimeout(() => {
		console.error('Could not close connection in time, forcefully shutting down');
		process.exit(1);
	}, 10000);
});

export default app;