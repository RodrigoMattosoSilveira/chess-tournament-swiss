import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import {CommonRoutesConfig} from './common/common.routes.config';
import {UserRoutes} from './model/user/user.routes.config';
import {TournamentRoutes} from './model/tournament/tournament.route.config';
import debug from 'debug';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

// We’ll listen on port 3000 instead of the standard ports 80 (HTTP) or 443 (HTTPS) because those would typically be
// used for an app’s front end.
//
// Why Port 3000?
// There is no rule that the port should be 3000—if unspecified, an arbitrary port will be assigned—but 3000 is used
// throughout the documentation examples for both Node.js and Express.js, so we continue the tradition here.
//
// Can Node.js Share Ports With the Front End?
// We can still run locally at a custom port, even when we want our back end to respond to requests on standard ports.
// This would require a reverse proxy to receive requests on port 80 or 443 with a specific domain or a subdomain. It
// would then redirect them to our internal port 3000.
const port: Number = 3000;

// The routes array will keep track of our routes files for debugging purposes
const routes: Array<CommonRoutesConfig> = [];

// debugLog will end up as a function similar to console.log, but better: It’s easier to fine-tune because it’s
// automatically scoped to whatever we want to call our file/module context. (In this case, we’ve called it “app” when
// we passed that in a string to the debug() constructor.)
const debugLog: debug.IDebugger = debug('app');

// here we add middleware to parse all incoming requests as JSON
app.use(bodyparser.json());

// here  we add middleware to allow cross-origin requests
app.use(cors());

// here  we add the expressWinston logging middleware, which will automatically log all HTTP requests handled by
// Express.js
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
routes.push(new UserRoutes(app));
routes.push(new TournamentRoutes(app));

// here we are configuring the expressWinston error-logging middleware,
// which doesn't *handle* errors per se, but does *log* them
app.use(expressWinston.errorLogger({
	transports: [
		new winston.transports.Console()
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.json()
	)
}));

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
	res.status(200).send(`Server up and running!`)
});

// This actually starts our server. Once it’s started, Node.js will run our callback function, which reports that we’re
// running, followed by the names of all the routes we’ve configured—so far, just UserRoutes.
server.listen(port, () => {
	debugLog(`Server running at http://localhost:${port}`);
	routes.forEach((route: CommonRoutesConfig) => {
		debugLog(`Routes configured for ${route.getName()}`);
	});
});
export default app;
export {server};
