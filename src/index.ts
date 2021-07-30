// Configuration
import {IConfig} from "./config/config.interface";
let config: IConfig = require('./config/config.dev.json');

// Servers
import { MongoAtlas } from "./server/mongodb";
import app from "./server/app";
const mongodb = new MongoAtlas(config.mongoDbAtlasURI, config.mongodbOptions);
mongodb.connect()
	.then(() => {
		console.log(`MongoDB Server running`);
		app.listen(config.expressServerPort, () => {
			console.log(`Express HTTP Server running`);
		});
	})
	.catch((err: any) => {
		throw (err);
	})

