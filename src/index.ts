// Configuration
import {IConfig} from "./config/config.interface";
let config: IConfig = require('./config/config.dev.json');

import { MongoAtlas } from "./server/mongodb";
import {launchServers} from "./server/swiss-pairing";

const mongodb = new MongoAtlas(config.mongoDbAtlasURI, config.mongodbOptions)
launchServers(mongodb);
